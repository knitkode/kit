import { act } from "react";
import { createRoot } from "react-dom/client";
import { useTraceUpdate } from "./useTraceUpdate";

// tells React to run effects synchronously inside `act()`
(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

type Props = { label: string; count: number; onClick?: () => void };

const Traced = (props: Props) => {
  useTraceUpdate(props);
  return null;
};

describe("useTraceUpdate", () => {
  let consoleInfo: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleInfo = vi.spyOn(console, "info").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleInfo.mockRestore();
  });

  it("does not log anything on mount", () => {
    const root = createRoot(document.createElement("div"));

    act(() => root.render(<Traced label="a" count={0} />));

    expect(consoleInfo).not.toHaveBeenCalled();

    act(() => root.unmount());
  });

  it("logs the changed props with their previous and next values", () => {
    const root = createRoot(document.createElement("div"));

    act(() => root.render(<Traced label="a" count={0} />));
    act(() => root.render(<Traced label="a" count={1} />));

    expect(consoleInfo).toHaveBeenCalledExactlyOnceWith(
      "[@knitkode/react:useTraceUpdate] changed props:",
      { count: [0, 1] },
    );

    act(() => root.render(<Traced label="b" count={2} />));

    expect(consoleInfo).toHaveBeenLastCalledWith(
      "[@knitkode/react:useTraceUpdate] changed props:",
      { label: ["a", "b"], count: [1, 2] },
    );

    act(() => root.unmount());
  });

  it("does not log when re-rendering with equal props", () => {
    const onClick = () => {};
    const root = createRoot(document.createElement("div"));

    act(() => root.render(<Traced label="a" count={0} onClick={onClick} />));
    act(() => root.render(<Traced label="a" count={0} onClick={onClick} />));

    expect(consoleInfo).not.toHaveBeenCalled();

    act(() => root.unmount());
  });

  it("detects props changing by reference", () => {
    const root = createRoot(document.createElement("div"));
    const first = () => {};
    const second = () => {};

    act(() => root.render(<Traced label="a" count={0} onClick={first} />));
    act(() => root.render(<Traced label="a" count={0} onClick={second} />));

    expect(consoleInfo).toHaveBeenCalledExactlyOnceWith(
      "[@knitkode/react:useTraceUpdate] changed props:",
      { onClick: [first, second] },
    );

    act(() => root.unmount());
  });
});
