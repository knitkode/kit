import { vitestSetNodeEnv } from "@knitkode/test/vitest";
import { off } from "./off";

describe("off", () => {
  vitestSetNodeEnv("development");

  let button: HTMLButtonElement;

  beforeEach(() => {
    // Set up a button element for testing
    button = document.createElement("button");
    button.id = "test-button";
    document.body.appendChild(button);
  });

  afterEach(() => {
    // Clean up the DOM after each test
    document.body.innerHTML = "";
  });

  test("removes an event listener from a valid element", () => {
    const mockHandler = vitest.fn();

    // First, add the event listener
    button.addEventListener("click", mockHandler);
    expect(mockHandler).toHaveBeenCalledTimes(0);

    // Simulate a click event
    button.click();
    expect(mockHandler).toHaveBeenCalledTimes(1);

    // Now, remove the event listener
    off(button, "click", mockHandler);

    // Simulate another click event
    button.click();
    expect(mockHandler).toHaveBeenCalledTimes(1); // Should not be called again
  });

  test("does nothing when the element does not exist", () => {
    const mockHandler = vitest.fn();
    const invalidElement = null; // Simulate non-existing element

    // @ts-expect-error test wrong implementation
    off(invalidElement, "click", mockHandler);

    // Ensure the handler is still not called
    button.click();
    expect(mockHandler).not.toHaveBeenCalled();
  });

  test("logs a warning when trying to remove a listener from a non-existing element in development mode", () => {
    const consoleSpy = vitest
      .spyOn(console, "warn")
      .mockImplementation(() => {});
    const invalidElement = null;

    // @ts-expect-error test wrong implementation
    off(invalidElement, "click", vitest.fn());

    expect(consoleSpy).toHaveBeenCalledWith(
      "[@knitkode/dom:off] unexisting DOM element",
    );

    consoleSpy.mockRestore(); // Clean up the spy
  });

  test("removes an event listener added with options", () => {
    const mockHandler = vitest.fn();

    // First, add the event listener with options
    button.addEventListener("click", mockHandler, { capture: true });
    expect(mockHandler).toHaveBeenCalledTimes(0);

    // Simulate a click event
    button.click();
    expect(mockHandler).toHaveBeenCalledTimes(1);

    // Now, remove the event listener
    off(button, "click", mockHandler, { capture: true });

    // Simulate another click event
    button.click();
    expect(mockHandler).toHaveBeenCalledTimes(1); // Should not be called again
  });

  test("only removes the given handler", () => {
    const removed = vitest.fn();
    const kept = vitest.fn();
    button.addEventListener("click", removed);
    button.addEventListener("click", kept);

    off(button, "click", removed);
    button.click();

    expect(removed).not.toHaveBeenCalled();
    expect(kept).toHaveBeenCalledTimes(1);
  });

  test("does not remove a capture listener without the capture option", () => {
    const mockHandler = vitest.fn();
    button.addEventListener("click", mockHandler, true);

    off(button, "click", mockHandler);
    button.click();
    expect(mockHandler).toHaveBeenCalledTimes(1);

    off(button, "click", mockHandler, true);
    button.click();
    expect(mockHandler).toHaveBeenCalledTimes(1);
  });

  test("removes listeners from the window", () => {
    const mockHandler = vitest.fn();
    window.addEventListener("resize", mockHandler);

    off(window, "resize", mockHandler);
    window.dispatchEvent(new Event("resize"));

    expect(mockHandler).not.toHaveBeenCalled();
  });
});

describe("off outside development", () => {
  vitestSetNodeEnv("production");

  test("silently ignores a non-existing element", () => {
    const consoleSpy = vitest
      .spyOn(console, "warn")
      .mockImplementation(() => {});

    // @ts-expect-error test wrong implementation
    expect(() => off(undefined, "click", vitest.fn())).not.toThrow();
    expect(consoleSpy).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
