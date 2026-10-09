import { act } from "react";
import { createRoot } from "react-dom/client";
import { useFirstMountState } from "./useFirstMountState";

// tells React to run effects synchronously inside `act()`
(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const unmounts: Array<() => void> = [];

function renderHook<Props, Result>(
  hook: (props: Props) => Result,
  initialProps: Props,
) {
  const results: Result[] = [];
  const container = document.createElement("div");
  const root = createRoot(container);
  const Probe = ({ props }: { props: Props }) => {
    results.push(hook(props));
    return null;
  };
  act(() => root.render(<Probe props={initialProps} />));
  let mounted = true;
  const unmount = () => {
    if (mounted) act(() => root.unmount());
    mounted = false;
  };
  unmounts.push(unmount);
  return {
    results,
    rerender: (props: Props) => act(() => root.render(<Probe props={props} />)),
    unmount,
  };
}

afterEach(() => {
  for (const unmount of unmounts.splice(0)) unmount();
});

describe("useFirstMountState", () => {
  it("returns true on the first render only", () => {
    const { results, rerender } = renderHook(() => useFirstMountState(), 0);

    expect(results).toEqual([true]);

    rerender(1);
    rerender(2);

    expect(results).toEqual([true, false, false]);
  });

  it("tracks each component instance separately", () => {
    const first = renderHook(() => useFirstMountState(), 0);
    first.rerender(1);
    const second = renderHook(() => useFirstMountState(), 0);

    expect(first.results).toEqual([true, false]);
    expect(second.results).toEqual([true]);
  });
});
