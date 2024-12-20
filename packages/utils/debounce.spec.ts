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
});
