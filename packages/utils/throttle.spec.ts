import { throttle } from "./throttle";

describe("throttle", () => {
  vitest.useFakeTimers();

  test("throttles a function call to the specified limit", () => {
    const mockFn = vitest.fn();
    const throttledFn = throttle(mockFn, 1000);

    // Call the throttled function multiple times
    throttledFn();
    throttledFn();
    throttledFn();

    // Only the first call should trigger the function within the throttle limit
    expect(mockFn).toHaveBeenCalledTimes(1);

    // Fast forward time by the throttle limit and call the function again
    vitest.advanceTimersByTime(1000);
    throttledFn();

    // The function should have been called a second time after the limit passed
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  test("respects the limit when called continuously", () => {
    const mockFn = vitest.fn();
    const throttledFn = throttle(mockFn, 500);

    // Call the function in rapid succession within the throttle limit
    throttledFn();
    vitest.advanceTimersByTime(100);
    throttledFn();
    vitest.advanceTimersByTime(100);
    throttledFn();
    vitest.advanceTimersByTime(100);
    throttledFn();

    // It should only be called once within the limit
    expect(mockFn).toHaveBeenCalledTimes(1);

    // Fast forward beyond the throttle limit
    vitest.advanceTimersByTime(500);
    throttledFn();

    // Now it should have been called a second time
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  test("works with provided context", () => {
    const context = { value: 42 };
    const mockFn = vitest.fn(function (this: typeof context) {
      return this.value;
    });
    const throttledFn = throttle(mockFn, 1000, context);

    // @ts-expect-error FIXME: type
    throttledFn();

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn.mock.results[0].value).toBe(42);
  });

  test("uses default context when none is provided", () => {
    const mockFn = vitest.fn();
    const throttledFn = throttle(mockFn, 1000);

    throttledFn.call({ custom: "context" });

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith(); // Called without explicit arguments
  });

  test("does not call function again until limit time passes", () => {
    const mockFn = vitest.fn();
    const throttledFn = throttle(mockFn, 1000);

    throttledFn();
    throttledFn();
    vitest.advanceTimersByTime(500); // Advance half of the throttle limit
    throttledFn();

    // Function should still have only been called once within this time
    expect(mockFn).toHaveBeenCalledTimes(1);

    vitest.advanceTimersByTime(500); // Complete the throttle limit
    throttledFn();

    // Now it should have been called twice
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  afterEach(() => {
    vitest.clearAllTimers();
  });
});
