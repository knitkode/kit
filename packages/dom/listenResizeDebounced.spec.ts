import { listenResizeDebounced } from "./listenResizeDebounced";

describe("listenResizeDebounced", () => {
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

  test("calls the handler once after a burst of window resizes", () => {
    const handler = vi.fn();
    unbind = listenResizeDebounced(undefined, handler, 100);

    resize();
    resize();
    resize();
    expect(handler).not.toHaveBeenCalled();

    vi.advanceTimersByTime(99);
    expect(handler).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(handler).toHaveBeenCalledTimes(1);
  });

  test("restarts the wait on every resize", () => {
    const handler = vi.fn();
    unbind = listenResizeDebounced(undefined, handler, 100);

    resize();
    vi.advanceTimersByTime(60);
    resize();
    vi.advanceTimersByTime(60);
    expect(handler).not.toHaveBeenCalled();

    vi.advanceTimersByTime(40);
    expect(handler).toHaveBeenCalledTimes(1);
  });

  test("calls the handler at the start of the burst when immediate is true", () => {
    const handler = vi.fn();
    unbind = listenResizeDebounced(undefined, handler, 100, true);

    resize();
    expect(handler).toHaveBeenCalledTimes(1);

    resize();
    vi.advanceTimersByTime(100);
    expect(handler).toHaveBeenCalledTimes(1);

    resize();
    expect(handler).toHaveBeenCalledTimes(2);
  });

  test("listens to the given element", () => {
    const handler = vi.fn();
    const el = document.createElement("div");
    unbind = listenResizeDebounced(el, handler, 50);

    resize(window);
    vi.advanceTimersByTime(50);
    expect(handler).not.toHaveBeenCalled();

    resize(el);
    vi.advanceTimersByTime(50);
    expect(handler).toHaveBeenCalledTimes(1);
  });

  test("returns a function that removes the listener", () => {
    const handler = vi.fn();
    listenResizeDebounced(undefined, handler, 100)();

    resize();
    vi.advanceTimersByTime(100);

    expect(handler).not.toHaveBeenCalled();
  });
});
