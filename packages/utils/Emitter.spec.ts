import { Emitter } from "./Emitter";

type Events = {
  change: number;
  close: undefined;
};

describe("Emitter", () => {
  it("calls the handlers registered for the emitted event with the data", () => {
    const emitter = Emitter<Events>("test");
    const handler = vi.fn();

    emitter.on("change", handler);
    emitter.emit("change", 1);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(1);
  });

  it("calls multiple handlers in registration order", () => {
    const emitter = Emitter<Events>("test");
    const calls: string[] = [];

    emitter.on("change", () => calls.push("first"));
    emitter.on("change", () => calls.push("second"));
    emitter.emit("change", 2);

    expect(calls).toEqual(["first", "second"]);
  });

  it("calls the handlers every time the event is emitted", () => {
    const emitter = Emitter<Events>("test");
    const handler = vi.fn();

    emitter.on("change", handler);
    emitter.emit("change", 1);
    emitter.emit("change", 2);

    expect(handler.mock.calls).toEqual([[1], [2]]);
  });

  it("only calls the handlers of the emitted event", () => {
    const emitter = Emitter<Events>("test");
    const onChange = vi.fn();
    const onClose = vi.fn();

    emitter.on("change", onChange);
    emitter.on("close", onClose);
    emitter.emit("close");

    expect(onChange).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledWith(undefined);
  });

  it("does nothing when emitting an event without handlers", () => {
    const emitter = Emitter<Events>("test");
    expect(() => emitter.emit("change", 1)).not.toThrow();
  });

  it("does not call handlers added while emitting until the next emit", () => {
    const emitter = Emitter<Events>("test");
    const late = vi.fn();

    emitter.on("change", () => emitter.on("change", late));
    emitter.emit("change", 1);
    expect(late).not.toHaveBeenCalled();

    emitter.emit("change", 2);
    expect(late).toHaveBeenCalledWith(2);
  });

  it("keeps the handlers of different emitters separate", () => {
    const a = Emitter<Events>("same");
    const b = Emitter<Events>("same");
    const handler = vi.fn();

    a.on("change", handler);
    b.emit("change", 1);

    expect(handler).not.toHaveBeenCalled();
  });
});
