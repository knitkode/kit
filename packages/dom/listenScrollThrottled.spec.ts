import { listenScrollThrottled } from "./listenScrollThrottled";

describe("listenScrollThrottled", () => {
  const scroll = (target: EventTarget) =>
    target.dispatchEvent(new Event("scroll"));
  let unbind: () => void = () => {};

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    unbind();
    unbind = () => {};
    vi.useRealTimers();
  });

  test("calls the handler at most once per limit while the window scrolls", () => {
    const handler = vi.fn();
    unbind = listenScrollThrottled(undefined, handler, 100);

    scroll(window);
    scroll(window);
    expect(handler).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(100);
    scroll(window);
    expect(handler).toHaveBeenCalledTimes(2);
  });

  test("calls the handler with the given context", () => {
    const context = { name: "ctx" };
    let receivedThis: unknown;
    unbind = listenScrollThrottled(
      undefined,
      function (this: unknown) {
        receivedThis = this;
      },
      100,
      context,
    );

    scroll(window);

    expect(receivedThis).toBe(context);
  });

  test("listens to the given element", () => {
    const handler = vi.fn();
    const el = document.createElement("div");
    unbind = listenScrollThrottled(el, handler, 100);

    scroll(window);
    expect(handler).not.toHaveBeenCalled();

    scroll(el);
    scroll(el);
    expect(handler).toHaveBeenCalledTimes(1);
  });

  test("returns a function that removes the listener", () => {
    const handler = vi.fn();
    listenScrollThrottled(undefined, handler, 100)();

    scroll(window);

    expect(handler).not.toHaveBeenCalled();
  });

  test("passes the scroll event to the handler", () => {
    const handler = vi.fn();
    unbind = listenScrollThrottled(undefined, handler, 100);
    const event = new Event("scroll");

    window.dispatchEvent(event);

    expect(handler).toHaveBeenCalledWith(event);
  });
});
