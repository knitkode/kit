import { debouncePromise } from "./debouncePromise";

describe("debouncePromise", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("calls the function after the wait time and resolves with its result", async () => {
    const fn = vi.fn((a: number, b: number) => a + b);
    const debounced = debouncePromise(fn, 100);

    const promise = debounced(1, 2);
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(99);
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(fn).toHaveBeenCalledWith(1, 2);
    await expect(promise).resolves.toBe(3);
  });

  it("waits 50ms by default", async () => {
    const fn = vi.fn(() => "done");
    const promise = debouncePromise(fn)();

    vi.advanceTimersByTime(49);
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    await expect(promise).resolves.toBe("done");
  });

  it("calls the function once with the last arguments and resolves every pending promise", async () => {
    const fn = vi.fn((value: string) => value.toUpperCase());
    const debounced = debouncePromise(fn, 100);

    const first = debounced("a");
    vi.advanceTimersByTime(50);
    const second = debounced("b");
    vi.advanceTimersByTime(50);
    const third = debounced("c");
    vi.advanceTimersByTime(100);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("c");
    await expect(Promise.all([first, second, third])).resolves.toEqual([
      "C",
      "C",
      "C",
    ]);
  });

  it("invokes again for calls after the wait time", async () => {
    const fn = vi.fn((value: number) => value * 2);
    const debounced = debouncePromise(fn, 100);

    const first = debounced(1);
    vi.advanceTimersByTime(100);
    const second = debounced(2);
    vi.advanceTimersByTime(100);

    expect(fn).toHaveBeenCalledTimes(2);
    await expect(first).resolves.toBe(2);
    await expect(second).resolves.toBe(4);
  });

  it("keeps the calling context", async () => {
    const context = { factor: 3 };
    const debounced = debouncePromise(function (
      this: typeof context,
      value: number,
    ) {
      return value * this.factor;
    }, 10);

    const promise = debounced.call(context, 2);
    vi.advanceTimersByTime(10);
    await expect(promise).resolves.toBe(6);
  });

  it("passes the result to the callback option", async () => {
    const callback = vi.fn();
    const debounced = debouncePromise(() => 42, 10, { callback });

    const promise = debounced();
    vi.advanceTimersByTime(10);

    await expect(promise).resolves.toBe(42);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(42);
  });

  describe("isImmediate", () => {
    it("calls the function right away and resolves with its result", async () => {
      const fn = vi.fn((value: string) => `${value}!`);
      const callback = vi.fn();
      const debounced = debouncePromise(fn, 100, {
        isImmediate: true,
        callback,
      });

      const promise = debounced("now");

      expect(fn).toHaveBeenCalledWith("now");
      expect(callback).toHaveBeenCalledWith("now!");
      await expect(promise).resolves.toBe("now!");
    });

    it("does not call the function again within the wait time", () => {
      const fn = vi.fn();
      const debounced = debouncePromise(fn, 100, { isImmediate: true });

      debounced();
      vi.advanceTimersByTime(50);
      debounced();
      vi.advanceTimersByTime(100);

      expect(fn).toHaveBeenCalledTimes(1);
    });

    it("calls the function right away again after the wait time", async () => {
      const fn = vi.fn((value: number) => value);
      const debounced = debouncePromise(fn, 100, { isImmediate: true });

      await expect(debounced(1)).resolves.toBe(1);
      vi.advanceTimersByTime(100);
      await expect(debounced(2)).resolves.toBe(2);
      expect(fn).toHaveBeenCalledTimes(2);
    });
  });

  describe("maxWait", () => {
    it("invokes the function at most after maxWait despite continuous calls", async () => {
      const fn = vi.fn((value: number) => value);
      const debounced = debouncePromise(fn, 50, { maxWait: 100 });

      const promises = [debounced(0)];
      for (const value of [1, 2, 3, 4]) {
        vi.advanceTimersByTime(20);
        promises.push(debounced(value));
      }
      // we are now at 80ms since the creation of the debounced function
      vi.advanceTimersByTime(19);
      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1);
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith(4);
      await expect(Promise.all(promises)).resolves.toEqual([4, 4, 4, 4, 4]);
    });

    it("waits the normal time when maxWait is far away", () => {
      const fn = vi.fn();
      const debounced = debouncePromise(fn, 50, { maxWait: 1000 });

      debounced();
      vi.advanceTimersByTime(49);
      expect(fn).not.toHaveBeenCalled();
      vi.advanceTimersByTime(1);
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe("cancel", () => {
    it("rejects the pending promises and does not call the function", async () => {
      const fn = vi.fn();
      const debounced = debouncePromise(fn, 100);

      const first = debounced();
      const second = debounced();
      debounced.cancel("cancelled");

      await expect(first).rejects.toBe("cancelled");
      await expect(second).rejects.toBe("cancelled");

      vi.advanceTimersByTime(200);
      expect(fn).not.toHaveBeenCalled();
    });

    it("can be called when nothing is pending", () => {
      const debounced = debouncePromise(vi.fn(), 100);
      expect(() => debounced.cancel()).not.toThrow();
    });

    it("lets the debounced function be used again afterwards", async () => {
      const debounced = debouncePromise((value: string) => value, 100);

      const cancelled = debounced("a");
      debounced.cancel();
      await expect(cancelled).rejects.toBeUndefined();

      const promise = debounced("b");
      vi.advanceTimersByTime(100);
      await expect(promise).resolves.toBe("b");
    });
  });
});
