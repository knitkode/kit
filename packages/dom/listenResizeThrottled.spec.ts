import { listenResizeThrottled } from "./listenResizeThrottled";

describe("listenResizeThrottled", () => {
  const resize = (target: EventTarget = window) =>
    target.dispatchEvent(new Event("resize"));
  let unbind: () => void = () => {};

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    unbind();
    unbind = () => {};
    vi.useRealTimers();
  });

  test("calls the handler at most once per limit while the window resizes", () => {
    const handler = vi.fn();
    unbind = listenResizeThrottled(undefined, handler, 100);

    resize();
    expect(handler).toHaveBeenCalledTimes(1);

    resize();
    vi.advanceTimersByTime(99);
    resize();
    expect(handler).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(1);
    resize();
    expect(handler).toHaveBeenCalledTimes(2);
  });

  test("calls the handler with the given context", () => {
    const context = { name: "ctx" };
    let receivedThis: unknown;
    unbind = listenResizeThrottled(
      undefined,
      function (this: unknown) {
        receivedThis = this;
      },
      100,
      context,
    );

    resize();

    expect(receivedThis).toBe(context);
  });

  test("listens to the given element", () => {
    const handler = vi.fn();
    const el = document.createElement("div");
    unbind = listenResizeThrottled(el, handler, 100);

    resize(window);
    expect(handler).not.toHaveBeenCalled();

    resize(el);
    expect(handler).toHaveBeenCalledTimes(1);
  });

  test("returns a function that removes the listener", () => {
    const handler = vi.fn();
    listenResizeThrottled(undefined, handler, 100)();

    resize();

    expect(handler).not.toHaveBeenCalled();
  });
});
