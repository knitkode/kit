import { act } from "react";
import { createRoot } from "react-dom/client";
import { usePrevious } from "./usePrevious";

// tells React to run effects synchronously inside `act()`
(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const unmounts: Array<() => void> = [];

function renderHook<Props, Result>(
  hook: (props: Props) => Result,
  initialProps: Props,
) {
  const result = { current: undefined as Result | undefined };
  const root = createRoot(document.createElement("div"));
  const Probe = ({ props }: { props: Props }) => {
    result.current = hook(props);
    return null;
  };
  act(() => root.render(<Probe props={initialProps} />));
  unmounts.push(() => act(() => root.unmount()));
  return {
    result,
    rerender: (props: Props) => act(() => root.render(<Probe props={props} />)),
  };
}

afterEach(() => {
  for (const unmount of unmounts.splice(0)) unmount();
});

describe("usePrevious", () => {
  it("returns the default value on mount", () => {
    const { result } = renderHook((state) => usePrevious(state, 0), 1);

    expect(result.current).toBe(0);
  });

  it("returns the default value on mount when it equals the state", () => {
    const { result } = renderHook((state) => usePrevious(state, "a"), "a");

    expect(result.current).toBe("a");
  });

  it("returns the previous distinct state after each change", () => {
    const { result, rerender } = renderHook(
      (state) => usePrevious(state, 0),
      1,
    );

    rerender(2);
    expect(result.current).toBe(1);

    rerender(3);
    expect(result.current).toBe(2);
  });

  it("keeps the previous state when re-rendering with the same state", () => {
    const { result, rerender } = renderHook(
      (state) => usePrevious(state, "initial"),
      "first",
    );

    rerender("second");
    rerender("second");
    rerender("second");

    expect(result.current).toBe("first");
  });

  it("compares the state by reference", () => {
    const first = { id: 1 };
    const second = { id: 1 };
    const { result, rerender } = renderHook(
      (state) => usePrevious<{ id: number } | null>(state, null),
      first,
    );

    rerender(second);

    expect(result.current).toBe(first);
  });
});
