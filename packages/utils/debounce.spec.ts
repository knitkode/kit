import { debounce } from "./debounce";

describe("debounce", () => {
  vitest.useFakeTimers(); // Use fake timers for controlling setTimeout

  let mockFunction: any;

  beforeEach(() => {
    mockFunction = vitest.fn(); // Create a mock function to test
  });

  afterEach(() => {
    vitest.clearAllTimers(); // Clear timers after each test
  });

  test("calls the function after the specified wait time", () => {
    const debouncedFn = debounce(mockFunction, 100);

    debouncedFn();
    expect(mockFunction).not.toHaveBeenCalled(); // Should not be called immediately

    vitest.advanceTimersByTime(100); // Fast-forward time
    expect(mockFunction).toHaveBeenCalledTimes(1); // Should be called once
  });

  test("calls the function immediately if immediate is true", () => {
    const debouncedFn = debounce(mockFunction, 100, true);

    debouncedFn();
    expect(mockFunction).toHaveBeenCalledTimes(1); // Should be called immediately
    expect(mockFunction).toHaveBeenCalledWith(); // Check if called with correct arguments

    vitest.advanceTimersByTime(100); // Fast-forward time
    expect(mockFunction).toHaveBeenCalledTimes(1); // Should still be called only once
  });

  test("does not call the function until after wait time when called multiple times", () => {
    const debouncedFn = debounce(mockFunction, 100);

    debouncedFn();
    debouncedFn(); // Rapid call, should reset the timer
    debouncedFn(); // Another rapid call

    expect(mockFunction).not.toHaveBeenCalled(); // Should not be called immediately

    vitest.advanceTimersByTime(100); // Fast-forward time
    expect(mockFunction).toHaveBeenCalledTimes(1); // Should only be called once after the last call
  });

  test("calls the function with the correct context", () => {
    const context = { value: 42 };
    const debouncedFn = debounce(function (this: typeof context) {
      expect(this.value).toBe(42); // Check context value
    }, 100);

    debouncedFn.call(context); // Call with specific context

    vitest.advanceTimersByTime(100); // Fast-forward time
  });

  test("does not call the function when wait time is 0", () => {
    const debouncedFn = debounce(mockFunction, 0);

    debouncedFn();
    expect(mockFunction).toHaveBeenCalledTimes(0);
  });
  test("calls the function with the arguments of the last call", () => {
    const debouncedFn = debounce(mockFunction, 100);

    debouncedFn("first", 1);
    debouncedFn("last", 2);
    vitest.advanceTimersByTime(100);

    expect(mockFunction).toHaveBeenCalledTimes(1);
    expect(mockFunction).toHaveBeenCalledWith("last", 2);
  });

  test("restarts the wait on every call", () => {
    const debouncedFn = debounce(mockFunction, 100);

    debouncedFn();
    vitest.advanceTimersByTime(80);
    debouncedFn();
    vitest.advanceTimersByTime(80);
    expect(mockFunction).not.toHaveBeenCalled();

    vitest.advanceTimersByTime(20);
    expect(mockFunction).toHaveBeenCalledTimes(1);
  });

  test("calls again after the wait time has elapsed", () => {
    const debouncedFn = debounce(mockFunction, 100);

    debouncedFn(1);
    vitest.advanceTimersByTime(100);
    debouncedFn(2);
    vitest.advanceTimersByTime(100);

    expect(mockFunction.mock.calls).toEqual([[1], [2]]);
  });

  test("in immediate mode it ignores the calls within the wait time", () => {
    const debouncedFn = debounce(mockFunction, 100, true);

    debouncedFn("a");
    vitest.advanceTimersByTime(80);
    debouncedFn("b");
    vitest.advanceTimersByTime(80);
    debouncedFn("c");
    expect(mockFunction.mock.calls).toEqual([["a"]]);

    vitest.advanceTimersByTime(100);
    debouncedFn("d");
    expect(mockFunction.mock.calls).toEqual([["a"], ["d"]]);
  });
});
