import { listenScrollThrottled } from "./listenScrollThrottled";

describe("listenScrollThrottled", () => {
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

  test("calls the handler at most once per limit while the window scrolls", () => {
    const handler = vi.fn();
    listenScrollThrottled(undefined, handler, 100);

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
    listenScrollThrottled(
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
    listenScrollThrottled(el, handler, 100);

    scroll(window);
    expect(handler).not.toHaveBeenCalled();

    scroll(el);
    scroll(el);
    expect(handler).toHaveBeenCalledTimes(1);
  });
});
