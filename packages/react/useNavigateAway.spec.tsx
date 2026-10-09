import { act } from "react";
import { createRoot } from "react-dom/client";
import {
  type UseNavigateAwayHandler,
  useNavigateAway,
} from "./useNavigateAway";

// tells React to run effects synchronously inside `act()`
(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const Probe = ({ handler }: { handler: UseNavigateAwayHandler }) => {
  useNavigateAway(handler);
  return null;
};

/**
 * jsdom's `BeforeUnloadEvent` cannot be constructed and its `returnValue` is
 * the legacy boolean one, so we dispatch a plain cancelable event exposing a
 * writable string `returnValue` as browsers do
 */
const dispatchBeforeUnload = () => {
  const event = new Event("beforeunload", { cancelable: true });
  Object.defineProperty(event, "returnValue", {
    value: undefined,
    writable: true,
  });
  window.dispatchEvent(event);
  return event as Event & { returnValue: unknown };
};

describe("useNavigateAway", () => {
  it("prompts with the custom message returned by the handler", () => {
    const handler = vi.fn<UseNavigateAwayHandler>(() => "Unsaved changes");
    const root = createRoot(document.createElement("div"));
    act(() => root.render(<Probe handler={handler} />));

    const event = dispatchBeforeUnload();

    expect(handler).toHaveBeenCalledExactlyOnceWith(event);
    expect(event.defaultPrevented).toBe(true);
    expect(event.returnValue).toBe("Unsaved changes");

    act(() => root.unmount());
  });

  it("prompts with an empty legacy return value when the handler returns true", () => {
    const root = createRoot(document.createElement("div"));
    act(() => root.render(<Probe handler={() => true} />));

    const event = dispatchBeforeUnload();

    expect(event.defaultPrevented).toBe(true);
    expect(event.returnValue).toBe("");

    act(() => root.unmount());
  });

  it("does not prompt when the handler returns false", () => {
    const root = createRoot(document.createElement("div"));
    act(() => root.render(<Probe handler={() => false} />));

    const event = dispatchBeforeUnload();

    expect(event.defaultPrevented).toBe(false);
    expect(event.returnValue).toBeUndefined();

    act(() => root.unmount());
  });

  it("does not prompt when the handler returns an empty message", () => {
    const root = createRoot(document.createElement("div"));
    act(() => root.render(<Probe handler={() => ""} />));

    const event = dispatchBeforeUnload();

    expect(event.defaultPrevented).toBe(false);

    act(() => root.unmount());
  });

  it("uses the latest handler without re-subscribing", () => {
    const addSpy = vi.spyOn(window, "addEventListener");
    const first = vi.fn<UseNavigateAwayHandler>(() => false);
    const second = vi.fn<UseNavigateAwayHandler>(() => "second");
    const root = createRoot(document.createElement("div"));

    act(() => root.render(<Probe handler={first} />));
    act(() => root.render(<Probe handler={second} />));
    const event = dispatchBeforeUnload();

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
    expect(event.returnValue).toBe("second");
    expect(
      addSpy.mock.calls.filter(([type]) => type === "beforeunload"),
    ).toHaveLength(1);

    act(() => root.unmount());
    addSpy.mockRestore();
  });

  it("removes the listener on unmount", () => {
    const handler = vi.fn<UseNavigateAwayHandler>(() => true);
    const root = createRoot(document.createElement("div"));
    act(() => root.render(<Probe handler={handler} />));
    act(() => root.unmount());

    const event = dispatchBeforeUnload();

    expect(handler).not.toHaveBeenCalled();
    expect(event.defaultPrevented).toBe(false);
  });
});
