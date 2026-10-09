import { emitEvent } from "./emitEvent";

describe("emitEvent", () => {
  const received: Event[] = [];
  const record = (event: Event) => {
    received.push(event);
  };

  afterEach(() => {
    received.length = 0;
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  test("dispatches a CustomEvent of the given type and detail on the document", () => {
    document.addEventListener("app:ready", record);

    emitEvent("app:ready", { id: 1 });

    document.removeEventListener("app:ready", record);
    expect(received).toHaveLength(1);
    const [event] = received as CustomEvent[];
    expect(event).toBeInstanceOf(CustomEvent);
    expect(event.type).toBe("app:ready");
    expect(event.target).toBe(document);
    expect(event.detail).toEqual({ id: 1 });
  });

  test("dispatches a bubbling event that reaches the window", () => {
    window.addEventListener("app:bubble", record);

    emitEvent("app:bubble");

    window.removeEventListener("app:bubble", record);
    expect(received).toHaveLength(1);
    expect(received[0]?.bubbles).toBe(true);
  });

  test("defaults to a `customEvent` type with an empty detail", () => {
    document.addEventListener("customEvent", record);

    emitEvent();

    document.removeEventListener("customEvent", record);
    expect(received).toHaveLength(1);
    expect((received[0] as CustomEvent).detail).toEqual({});
  });

  test("does nothing when CustomEvent is not supported", () => {
    const dispatch = vi.spyOn(document, "dispatchEvent");
    vi.stubGlobal("CustomEvent", undefined);

    expect(() => emitEvent("app:ready")).not.toThrow();
    expect(dispatch).not.toHaveBeenCalled();
  });
});
