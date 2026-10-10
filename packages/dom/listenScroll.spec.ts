import { listenScroll } from "./listenScroll";

describe("listenScroll", () => {
  const scroll = (target: EventTarget) =>
    target.dispatchEvent(new Event("scroll"));
  let unbind: () => void = () => {};

  afterEach(() => {
    unbind();
    unbind = () => {};
    vi.restoreAllMocks();
    document.body.innerHTML = "";
  });

  test("listens to the window scroll by default, in the capture phase and passively", () => {
    const addEventListener = vi.spyOn(window, "addEventListener");
    const handler = vi.fn();

    unbind = listenScroll(handler);
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

    unbind = listenScroll(handler);
    scroll(el);

    expect(handler).toHaveBeenCalledTimes(1);
  });

  test("falls back to the window when the element is falsy", () => {
    const handler = vi.fn();

    unbind = listenScroll(handler, null);
    scroll(window);

    expect(handler).toHaveBeenCalledTimes(1);
  });

  test("listens to the scroll of the given element only", () => {
    const handler = vi.fn();
    const el = document.createElement("div");

    unbind = listenScroll(handler, el);
    scroll(window);
    expect(handler).not.toHaveBeenCalled();

    scroll(el);
    expect(handler).toHaveBeenCalledTimes(1);
  });

  test("returns a function that removes the listener", () => {
    const handler = vi.fn();
    const el = document.createElement("div");

    listenScroll(handler)();
    listenScroll(handler, el)();
    scroll(window);
    scroll(el);

    expect(handler).not.toHaveBeenCalled();
  });
});
