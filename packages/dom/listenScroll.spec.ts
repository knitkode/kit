import { listenScroll } from "./listenScroll";

describe("listenScroll", () => {
  const scroll = (target: EventTarget) =>
    target.dispatchEvent(new Event("scroll"));
  const spyOnAddEventListener = () => vi.spyOn(window, "addEventListener");
  let addEventListener: ReturnType<typeof spyOnAddEventListener>;

  beforeEach(() => {
    addEventListener = spyOnAddEventListener();
  });

  afterEach(() => {
    // remove the window listeners directly, with the options they were added with
    for (const [type, listener, options] of addEventListener.mock.calls) {
      window.removeEventListener(type, listener, options);
    }
    vi.restoreAllMocks();
    document.body.innerHTML = "";
  });

  test("listens to the window scroll by default, in the capture phase and passively", () => {
    const handler = vi.fn();

    listenScroll(handler);
    scroll(window);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(addEventListener).toHaveBeenCalledWith("scroll", handler, {
      capture: true,
      passive: true,
    });
  });

  test("catches the scroll of any element of the document by default", () => {
    const handler = vi.fn();
    const el = document.createElement("div");
    document.body.appendChild(el);

    listenScroll(handler);
    scroll(el);

    expect(handler).toHaveBeenCalledTimes(1);
  });

  test("falls back to the window when the element is falsy", () => {
    const handler = vi.fn();

    listenScroll(handler, null);
    scroll(window);

    expect(handler).toHaveBeenCalledTimes(1);
  });

  test("listens to the scroll of the given element only", () => {
    const handler = vi.fn();
    const el = document.createElement("div");

    listenScroll(handler, el);
    scroll(window);
    expect(handler).not.toHaveBeenCalled();

    scroll(el);
    expect(handler).toHaveBeenCalledTimes(1);
  });
});
