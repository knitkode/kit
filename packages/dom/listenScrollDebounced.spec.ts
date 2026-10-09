import { listenScrollDebounced } from "./listenScrollDebounced";

describe("listenScrollDebounced", () => {
  const scroll = (target: EventTarget) =>
    target.dispatchEvent(new Event("scroll"));
  const spyOnAddEventListener = () => vi.spyOn(window, "addEventListener");
  let addEventListener: ReturnType<typeof spyOnAddEventListener>;

  beforeEach(() => {
    vi.useFakeTimers();
    addEventListener = spyOnAddEventListener();
  });

  afterEach(() => {
    // remove the window listeners directly, with the options they were added with
    for (const [type, listener, options] of addEventListener.mock.calls) {
      window.removeEventListener(type, listener, options);
    }
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  test("calls the handler once after a burst of window scrolls", () => {
    const handler = vi.fn();
    listenScrollDebounced(undefined, handler, 100);

    scroll(window);
    vi.advanceTimersByTime(60);
    scroll(window);
    vi.advanceTimersByTime(60);
    expect(handler).not.toHaveBeenCalled();

    vi.advanceTimersByTime(40);
    expect(handler).toHaveBeenCalledTimes(1);
  });

  test("calls the handler at the start of the burst when immediate is true", () => {
    const handler = vi.fn();
    listenScrollDebounced(undefined, handler, 100, true);

    scroll(window);
    scroll(window);
    expect(handler).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(100);
    expect(handler).toHaveBeenCalledTimes(1);
  });

  test("listens to the given element", () => {
    const handler = vi.fn();
    const el = document.createElement("div");
    listenScrollDebounced(el, handler, 50);

    scroll(window);
    vi.advanceTimersByTime(50);
    expect(handler).not.toHaveBeenCalled();

    scroll(el);
    scroll(el);
    vi.advanceTimersByTime(50);
    expect(handler).toHaveBeenCalledTimes(1);
  });
});
