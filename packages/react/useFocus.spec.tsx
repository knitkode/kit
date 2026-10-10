import { act, type RefObject } from "react";
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
      focus = setFocus;
      return <input ref={ref} />;
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
      focus = setFocus;
      return <input />;
    };
    const root = createRoot(container);
    act(() => root.render(<Probe />));

    expect(() => focus()).not.toThrow();
    expect(document.activeElement).toBe(document.body);

    act(() => root.unmount());
  });

  it("focuses the referenced element of the given type", () => {
    let focus: () => void = () => {};
    const Probe = () => {
      const [ref, setFocus] = useFocus<HTMLSelectElement>();
      focus = setFocus;
      return <select ref={ref} />;
    };
    const root = createRoot(container);
    act(() => root.render(<Probe />));

    act(() => focus());

    expect(document.activeElement).toBe(container.querySelector("select"));

    act(() => root.unmount());
  });

  it("returns a tuple of an element ref and a focus function", () => {
    const Probe = () => {
      const input = useFocus();
      const textarea = useFocus<HTMLTextAreaElement>();

      expectTypeOf(input).toEqualTypeOf<
        readonly [RefObject<HTMLInputElement | null>, () => void]
      >();
      expectTypeOf(textarea).toEqualTypeOf<
        readonly [RefObject<HTMLTextAreaElement | null>, () => void]
      >();
      return null;
    };
    const root = createRoot(container);
    act(() => root.render(<Probe />));
    act(() => root.unmount());
  });
});
