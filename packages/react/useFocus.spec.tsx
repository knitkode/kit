import { act } from "react";
import { createRoot } from "react-dom/client";
import { useFocus } from "./useFocus";

// tells React to run effects synchronously inside `act()`
(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

describe("useFocus", () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    // focus only works on elements attached to the document
    container = document.createElement("div");
    document.body.append(container);
  });

  afterEach(() => {
    container.remove();
  });

  it("returns a ref and a function focusing the referenced element", () => {
    let focus: () => void = () => {};
    const Probe = () => {
      const [ref, setFocus] = useFocus();
      if (typeof setFocus === "function") focus = setFocus;
      return typeof ref === "function" ? null : (
        // @ts-expect-error the ref is typed for input, select and textarea at once so it fits none of them
        <input ref={ref} />
      );
    };
    const root = createRoot(container);
    act(() => root.render(<Probe />));
    const input = container.querySelector("input");

    expect(input).not.toBeNull();
    expect(document.activeElement).not.toBe(input);

    act(() => focus());

    expect(document.activeElement).toBe(input);

    act(() => root.unmount());
  });

  it("does nothing when the ref is not attached", () => {
    let focus: () => void = () => {
      throw new Error("not assigned");
    };
    const Probe = () => {
      const [, setFocus] = useFocus();
      if (typeof setFocus === "function") focus = setFocus;
      return <input />;
    };
    const root = createRoot(container);
    act(() => root.render(<Probe />));

    expect(() => focus()).not.toThrow();
    expect(document.activeElement).toBe(document.body);

    act(() => root.unmount());
  });
});
