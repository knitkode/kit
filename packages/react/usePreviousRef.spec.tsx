import { act } from "react";
import { createRoot } from "react-dom/client";
import { usePreviousRef } from "./usePreviousRef";

// tells React to run effects synchronously inside `act()`
(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

describe("usePreviousRef", () => {
  it("returns the value of the previous render", () => {
    const results: Array<string | null> = [];
    const Probe = ({ value }: { value: string }) => {
      results.push(usePreviousRef(value));
      return null;
    };
    const root = createRoot(document.createElement("div"));

    act(() => root.render(<Probe value="a" />));
    expect(results).toEqual([null]);

    act(() => root.render(<Probe value="b" />));
    expect(results).toEqual([null, "a"]);

    act(() => root.render(<Probe value="c" />));
    expect(results).toEqual([null, "a", "b"]);

    act(() => root.unmount());
  });

  it("returns the same value when the render did not change it", () => {
    const results: Array<number | null> = [];
    const Probe = ({ value }: { value: number; tick: number }) => {
      results.push(usePreviousRef(value));
      return null;
    };
    const root = createRoot(document.createElement("div"));

    act(() => root.render(<Probe value={1} tick={0} />));
    act(() => root.render(<Probe value={2} tick={1} />));
    act(() => root.render(<Probe value={2} tick={2} />));

    expect(results).toEqual([null, 1, 2]);

    act(() => root.unmount());
  });
});
