import { debounceRaf } from "./debounceRaf";

describe("debounceRaf", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("calls the function on the next animation frame", () => {
    const fn = vi.fn();
    const debounced = debounceRaf(fn);

    debounced("a", 1);
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersToNextFrame();
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("a", 1);
  });

  it("only calls the function once per frame with the last arguments", () => {
    const cancelAnimationFrame = vi.spyOn(window, "cancelAnimationFrame");
    const fn = vi.fn();
    const debounced = debounceRaf(fn);

    debounced(1);
    debounced(2);
    debounced(3);
    vi.advanceTimersToNextFrame();

    expect(cancelAnimationFrame).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(3);
  });

  it("calls the function again on later frames", () => {
    const fn = vi.fn();
    const debounced = debounceRaf(fn);

    debounced(1);
    vi.advanceTimersToNextFrame();
    debounced(2);
    vi.advanceTimersToNextFrame();

    expect(fn.mock.calls).toEqual([[1], [2]]);
  });

  it("keeps the calling context", () => {
    const fn = vi.fn();
    const debounced = debounceRaf(fn);
    const context = { id: "ctx" };

    debounced.call(context);
    vi.advanceTimersToNextFrame();

    expect(fn.mock.contexts[0]).toBe(context);
  });
});
