import { act } from "react";
import { createRoot } from "react-dom/client";
import { useUpdateEffect } from "./useUpdateEffect";

// tells React to run effects synchronously inside `act()`
(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

describe("useUpdateEffect", () => {
  const log: string[] = [];
  const Probe = ({ value, other = 0 }: { value: number; other?: number }) => {
    useUpdateEffect(() => {
      log.push(`effect:${value}`);
      return () => {
        log.push(`cleanup:${value}`);
      };
    }, [value]);
    return <i>{other}</i>;
  };

  afterEach(() => {
    log.length = 0;
  });

  it("does not run the effect on mount", () => {
    const root = createRoot(document.createElement("div"));

    act(() => root.render(<Probe value={1} />));

    expect(log).toEqual([]);

    act(() => root.unmount());
    expect(log).toEqual([]);
  });

  it("runs the effect when the deps change after mount", () => {
    const root = createRoot(document.createElement("div"));

    act(() => root.render(<Probe value={1} />));
    act(() => root.render(<Probe value={2} />));

    expect(log).toEqual(["effect:2"]);

    act(() => root.unmount());
  });

  it("does not run the effect when re-rendering with the same deps", () => {
    const root = createRoot(document.createElement("div"));

    act(() => root.render(<Probe value={1} />));
    act(() => root.render(<Probe value={2} />));
    act(() => root.render(<Probe value={2} other={1} />));

    expect(log).toEqual(["effect:2"]);

    act(() => root.unmount());
  });

  it("runs the cleanup before the next effect and on unmount", () => {
    const root = createRoot(document.createElement("div"));

    act(() => root.render(<Probe value={1} />));
    act(() => root.render(<Probe value={2} />));
    act(() => root.render(<Probe value={3} />));
    act(() => root.unmount());

    expect(log).toEqual(["effect:2", "cleanup:2", "effect:3", "cleanup:3"]);
  });
});
