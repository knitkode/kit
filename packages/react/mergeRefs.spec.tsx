import { act, createRef, type Ref } from "react";
import { createRoot } from "react-dom/client";
import { mergeRefs } from "./mergeRefs";

// tells React to run effects synchronously inside `act()`
(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

describe("mergeRefs", () => {
  it("calls the callback refs with the value", () => {
    const first = vi.fn();
    const second = vi.fn();
    const node = document.createElement("div");

    mergeRefs<HTMLDivElement>([first, second])(node);

    expect(first).toHaveBeenCalledExactlyOnceWith(node);
    expect(second).toHaveBeenCalledExactlyOnceWith(node);
  });

  it("assigns the value to the object refs", () => {
    const objectRef = createRef<HTMLDivElement>();
    const node = document.createElement("div");

    mergeRefs<HTMLDivElement | null>([objectRef])(node);

    expect(objectRef.current).toBe(node);
  });

  it("mixes callback and object refs and skips nullish ones", () => {
    const callbackRef = vi.fn();
    const objectRef = createRef<HTMLSpanElement>();
    const node = document.createElement("span");

    const merged = mergeRefs<HTMLSpanElement | null>([
      callbackRef,
      null,
      objectRef,
    ]);

    expect(() => merged(node)).not.toThrow();
    expect(callbackRef).toHaveBeenCalledWith(node);
    expect(objectRef.current).toBe(node);
  });

  it("attaches and detaches every ref through React", () => {
    const callbackRef = vi.fn();
    const objectRef = createRef<HTMLButtonElement>();
    const container = document.createElement("div");
    const root = createRoot(container);
    const Button = ({ buttonRef }: { buttonRef: Ref<HTMLButtonElement> }) => (
      <button type="button" ref={buttonRef} />
    );

    act(() =>
      root.render(
        <Button
          buttonRef={mergeRefs<HTMLButtonElement | null>([
            callbackRef,
            objectRef,
          ])}
        />,
      ),
    );

    const button = container.querySelector("button");
    expect(button).not.toBeNull();
    expect(callbackRef).toHaveBeenLastCalledWith(button);
    expect(objectRef.current).toBe(button);

    act(() => root.unmount());

    expect(callbackRef).toHaveBeenLastCalledWith(null);
    expect(objectRef.current).toBeNull();
  });
});
