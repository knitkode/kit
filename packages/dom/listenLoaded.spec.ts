import { listenLoaded } from "./listenLoaded";

describe("listenLoaded", () => {
  test("calls the handler with the event when the DOM content is loaded", () => {
    const handler = vi.fn();
    const unbind = listenLoaded(handler);

    const event = new Event("DOMContentLoaded");
    document.dispatchEvent(event);
    unbind();

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(event);
  });

  test("ignores other events", () => {
    const handler = vi.fn();
    const unbind = listenLoaded(handler);

    document.dispatchEvent(new Event("load"));
    window.dispatchEvent(new Event("DOMContentLoaded"));
    unbind();

    expect(handler).not.toHaveBeenCalled();
  });

  test("returns a function that removes the listener", () => {
    const handler = vi.fn();
    const unbind = listenLoaded(handler);

    unbind();
    document.dispatchEvent(new Event("DOMContentLoaded"));

    expect(handler).not.toHaveBeenCalled();
  });
});
