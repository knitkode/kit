import { act } from "react";
import { createRoot } from "react-dom/client";
import { useMountedState } from "./useMountedState";

// tells React to run effects synchronously inside `act()`
(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

describe("useMountedState", () => {
  it("reports false while rendering, true once mounted and false after unmount", () => {
    const duringRender: boolean[] = [];
    let isMounted: () => boolean = () => true;
    const Probe = () => {
      isMounted = useMountedState();
      duringRender.push(isMounted());
      return null;
    };
    const root = createRoot(document.createElement("div"));

    act(() => root.render(<Probe />));

    expect(duringRender).toEqual([false]);
    expect(isMounted()).toBe(true);

    act(() => root.unmount());

    expect(isMounted()).toBe(false);
  });

  it("returns a stable getter across re-renders", () => {
    const getters: Array<() => boolean> = [];
    const Probe = ({ count }: { count: number }) => {
      getters.push(useMountedState());
      return <i>{count}</i>;
    };
    const root = createRoot(document.createElement("div"));

    act(() => root.render(<Probe count={0} />));
    act(() => root.render(<Probe count={1} />));

    expect(getters).toHaveLength(2);
    expect(getters[0]).toBe(getters[1]);

    act(() => root.unmount());
  });
});
