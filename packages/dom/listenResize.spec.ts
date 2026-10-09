import { listenResize } from "./listenResize";

describe("listenResize", () => {
  const resize = (target: EventTarget) =>
    target.dispatchEvent(new Event("resize"));

  test("listens to the window resize by default", () => {
    const handler = vi.fn();
    const unbind = listenResize(handler);

    resize(window);
    resize(window);
    unbind();

    expect(handler).toHaveBeenCalledTimes(2);
  });

  test("falls back to the window when the element is falsy", () => {
    const handler = vi.fn();
    const unbind = listenResize(handler, null);

    resize(window);
    unbind();

    expect(handler).toHaveBeenCalledTimes(1);
  });

  test("listens to the resize of the given element only", () => {
    const handler = vi.fn();
    const el = document.createElement("div");
    const unbind = listenResize(handler, el);

    resize(window);
    expect(handler).not.toHaveBeenCalled();

    resize(el);
    expect(handler).toHaveBeenCalledTimes(1);
    unbind();
  });

  test("returns a function that removes the listener", () => {
    const handler = vi.fn();
    const unbind = listenResize(handler);

    unbind();
    resize(window);

    expect(handler).not.toHaveBeenCalled();
  });
});
