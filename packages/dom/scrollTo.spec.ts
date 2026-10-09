import { scrollTo } from "./scrollTo";

describe("scrollTo", () => {
  let currentScroll = 0;
  const spyOnScrollTo = () =>
    vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  let nativeScrollTo: ReturnType<typeof spyOnScrollTo>;

  /** Simulates the window scrolling to the given position */
  const scrollWindow = (y: number) => {
    currentScroll = y;
    window.dispatchEvent(new Event("scroll"));
  };

  beforeEach(() => {
    currentScroll = 0;
    vi.useFakeTimers();
    vi.spyOn(window, "pageYOffset", "get").mockImplementation(
      () => currentScroll,
    );
    nativeScrollTo = spyOnScrollTo();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  test("scrolls the window smoothly to the destination by default", () => {
    scrollTo(400);

    expect(nativeScrollTo).toHaveBeenCalledWith({
      top: 400,
      behavior: "smooth",
    });
  });

  test("scrolls the window with the given behavior", () => {
    scrollTo(400, undefined, undefined, "instant");

    expect(nativeScrollTo).toHaveBeenCalledWith({
      top: 400,
      behavior: "instant",
    });
  });

  test("calls the callback once the window reaches the destination", () => {
    const callback = vi.fn();
    scrollTo(300, callback);

    scrollWindow(120);
    scrollWindow(250);
    expect(callback).not.toHaveBeenCalled();

    scrollWindow(300);
    expect(callback).toHaveBeenCalledTimes(1);

    scrollWindow(200);
    scrollWindow(300);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test("calls the callback right away when the window is already at the destination", () => {
    const callback = vi.fn();
    currentScroll = 300;

    scrollTo(300, callback);
    expect(callback).toHaveBeenCalledTimes(1);

    scrollWindow(300);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test("compares positions rounded to the pixel", () => {
    const callback = vi.fn();
    scrollTo(299.6, callback);

    scrollWindow(299.7);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  test("calls the callback after the fallback timeout when the destination is never reached", () => {
    const callback = vi.fn();
    scrollTo(300, callback, 1000);

    scrollWindow(280);
    vi.advanceTimersByTime(999);
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledTimes(1);

    scrollWindow(300);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test("does not call the callback again after the fallback timeout when the destination was reached", () => {
    const callback = vi.fn();
    scrollTo(300, callback, 1000);

    scrollWindow(300);
    vi.advanceTimersByTime(1000);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  test("does not listen to the scroll without a callback", () => {
    const addEventListener = vi.spyOn(window, "addEventListener");

    scrollTo(300);

    expect(addEventListener).not.toHaveBeenCalled();
  });
});
