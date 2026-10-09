import { act } from "react";
import { createRoot } from "react-dom/client";
import { useKeyUp } from "./useKeyUp";

// tells React to run effects synchronously inside `act()`
(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

type Props = { callback: (event: KeyboardEvent) => void; deps?: unknown[] };

const Probe = ({ callback, deps }: Props) => {
  useKeyUp(callback, deps);
  return null;
};

const keyUp = (init: KeyboardEventInit) =>
  window.dispatchEvent(new KeyboardEvent("keyup", init));

describe("useKeyUp", () => {
  it("calls the callback with the keyup events of the window", () => {
    const callback = vi.fn();
    const root = createRoot(document.createElement("div"));
    act(() => root.render(<Probe callback={callback} />));

    keyUp({ key: "Escape" });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback.mock.calls[0]?.[0]).toBeInstanceOf(KeyboardEvent);
    expect(callback.mock.calls[0]?.[0].key).toBe("Escape");

    act(() => root.unmount());
  });

  it.each([["ctrlKey"], ["altKey"], ["shiftKey"], ["metaKey"]] as const)(
    "ignores key combinations with %s",
    (modifier) => {
      const callback = vi.fn();
      const root = createRoot(document.createElement("div"));
      act(() => root.render(<Probe callback={callback} />));

      keyUp({ key: "ArrowLeft", [modifier]: true });

      expect(callback).not.toHaveBeenCalled();

      act(() => root.unmount());
    },
  );

  it("ignores other keyboard events", () => {
    const callback = vi.fn();
    const root = createRoot(document.createElement("div"));
    act(() => root.render(<Probe callback={callback} />));

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));

    expect(callback).not.toHaveBeenCalled();

    act(() => root.unmount());
  });

  it("calls the latest callback after it changes", () => {
    const first = vi.fn();
    const second = vi.fn();
    const root = createRoot(document.createElement("div"));
    act(() => root.render(<Probe callback={first} />));
    act(() => root.render(<Probe callback={second} />));

    keyUp({ key: "a" });

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);

    act(() => root.unmount());
  });

  it("re-subscribes when the extra deps change", () => {
    const addSpy = vi.spyOn(window, "addEventListener");
    const callback = vi.fn();
    const root = createRoot(document.createElement("div"));
    const keyupSubscriptions = () =>
      addSpy.mock.calls.filter(([type]) => type === "keyup").length;

    act(() => root.render(<Probe callback={callback} deps={[1]} />));
    act(() => root.render(<Probe callback={callback} deps={[1]} />));
    expect(keyupSubscriptions()).toBe(1);

    act(() => root.render(<Probe callback={callback} deps={[2]} />));
    expect(keyupSubscriptions()).toBe(2);

    keyUp({ key: "a" });
    expect(callback).toHaveBeenCalledTimes(1);

    act(() => root.unmount());
    addSpy.mockRestore();
  });

  it("removes the listener on unmount", () => {
    const callback = vi.fn();
    const root = createRoot(document.createElement("div"));
    act(() => root.render(<Probe callback={callback} />));
    act(() => root.unmount());

    keyUp({ key: "a" });

    expect(callback).not.toHaveBeenCalled();
  });
});
