import { tryUntil } from "./tryUntil";

describe("tryUntil", () => {
  vitest.useFakeTimers();

  it("should resolve when the test function returns true", () => {
    const testFn = vitest.fn(() => true);
    const resolveFn = vitest.fn();
    const rejectFn = vitest.fn();

    tryUntil(testFn, 1000, 100, resolveFn, rejectFn);

    // Fast-forward time
    vitest.advanceTimersByTime(500);

    expect(testFn).toHaveBeenCalled();
    expect(resolveFn).toHaveBeenCalled();
    expect(rejectFn).not.toHaveBeenCalled();
  });

  it("should reject when the timeout is reached", () => {
    const testFn = vitest.fn(() => false);
    const resolveFn = vitest.fn();
    const rejectFn = vitest.fn();

    tryUntil(testFn, 500, 100, resolveFn, rejectFn);

    // Fast-forward time to exceed the timeout
    vitest.advanceTimersByTime(600);

    expect(testFn).toHaveBeenCalledTimes(6); // (600 / 100) + 1 for initial call
    expect(resolveFn).not.toHaveBeenCalled();
    expect(rejectFn).toHaveBeenCalled();
  });

  it("should continue checking until timeout with interval", () => {
    const testFn = vitest.fn(() => false);
    const resolveFn = vitest.fn();
    const rejectFn = vitest.fn();

    tryUntil(testFn, 1000, 200, resolveFn, rejectFn);

    // Fast-forward time less than timeout
    vitest.advanceTimersByTime(800);

    expect(testFn).toHaveBeenCalledTimes(4); // (800 / 200)
    expect(resolveFn).not.toHaveBeenCalled();
    expect(rejectFn).not.toHaveBeenCalled();
  });

  it("should handle immediate resolution", () => {
    const testFn = vitest.fn(() => true);
    const resolveFn = vitest.fn();

    tryUntil(testFn, 1000, 100, resolveFn);

    // Fast-forward time
    vitest.advanceTimersByTime(100);

    expect(testFn).toHaveBeenCalledTimes(1);
    expect(resolveFn).toHaveBeenCalled();
  });

  it("should work with reject function provided", () => {
    const testFn = vitest.fn(() => false);
    const resolveFn = vitest.fn();
    const rejectFn = vitest.fn();

    tryUntil(testFn, 500, 100, resolveFn, rejectFn);

    // Fast-forward time to exceed the timeout
    vitest.advanceTimersByTime(600);

    expect(rejectFn).toHaveBeenCalled();
  });

  it("should not call reject if it is not provided", () => {
    const testFn = vitest.fn(() => false);
    const resolveFn = vitest.fn();

    tryUntil(testFn, 500, 100, resolveFn);

    // Fast-forward time to exceed the timeout
    vitest.advanceTimersByTime(600);

    expect(resolveFn).not.toHaveBeenCalled();
  });
  it("should stop polling once resolved", () => {
    const testFn = vitest
      .fn()
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(false)
      .mockReturnValue(true);
    const resolveFn = vitest.fn();

    tryUntil(testFn, 10000, 100, resolveFn);
    vitest.advanceTimersByTime(1000);

    expect(testFn).toHaveBeenCalledTimes(3);
    expect(resolveFn).toHaveBeenCalledTimes(1);
  });

  it("should stop polling once rejected", () => {
    const testFn = vitest.fn(() => false);
    const rejectFn = vitest.fn();

    tryUntil(testFn, 250, 100, vitest.fn(), rejectFn);
    vitest.advanceTimersByTime(300);
    const callsAtRejection = testFn.mock.calls.length;
    vitest.advanceTimersByTime(1000);

    expect(rejectFn).toHaveBeenCalledTimes(1);
    expect(testFn).toHaveBeenCalledTimes(callsAtRejection);
  });

  it("should not test before the first interval", () => {
    const testFn = vitest.fn(() => true);
    const resolveFn = vitest.fn();

    tryUntil(testFn, 1000, 100, resolveFn);
    vitest.advanceTimersByTime(99);

    expect(testFn).not.toHaveBeenCalled();
    expect(resolveFn).not.toHaveBeenCalled();
  });
});
