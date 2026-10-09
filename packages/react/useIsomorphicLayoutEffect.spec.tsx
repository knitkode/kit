import { act, useEffect, useLayoutEffect } from "react";
import { createRoot } from "react-dom/client";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";

// tells React to run effects synchronously inside `act()`
(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

describe("useIsomorphicLayoutEffect", () => {
  it("is `useLayoutEffect` in the browser", () => {
    expect(useIsomorphicLayoutEffect).toBe(useLayoutEffect);
  });

  it("runs before the passive effects and cleans up on unmount", () => {
    const log: string[] = [];
    const Probe = () => {
      useEffect(() => {
        log.push("effect");
      }, []);
      useIsomorphicLayoutEffect(() => {
        log.push("layout");
        return () => {
          log.push("layout cleanup");
        };
      }, []);
      return null;
    };
    const root = createRoot(document.createElement("div"));

    act(() => root.render(<Probe />));
    expect(log).toEqual(["layout", "effect"]);

    act(() => root.unmount());
    expect(log).toEqual(["layout", "effect", "layout cleanup"]);
  });
});
