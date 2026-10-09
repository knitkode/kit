import { vitestSetNodeEnv } from "@knitkode/test/vitest";
import { once } from "./once";

describe("once", () => {
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

  test("calls the handler only once", () => {
    const mockHandler = vitest.fn();

    // Add the event listener using `once`
    once(button, "click", mockHandler);

    // Simulate a click event
    button.click();
    expect(mockHandler).toHaveBeenCalledTimes(1);

    // Simulate another click event
    button.click();
    expect(mockHandler).toHaveBeenCalledTimes(1); // Should still be called only once
  });

  test("removes the event listener after it is called", () => {
    const mockHandler = vitest.fn();

    // Add the event listener using `once`
    once(button, "click", mockHandler);

    // Simulate a click event
    button.click();
    expect(mockHandler).toHaveBeenCalledTimes(1);

    // Simulate another click event
    button.click();
    expect(mockHandler).toHaveBeenCalledTimes(1); // Should still be called only once

    // Directly check if the event listener was removed
    const event = new MouseEvent("click");
    button.dispatchEvent(event);
    expect(mockHandler).toHaveBeenCalledTimes(1); // Should not increase
  });

  test("passes the event to the handler", () => {
    const mockHandler = vitest.fn();

    once(button, "click", mockHandler);
    button.click();

    expect(mockHandler).toHaveBeenCalledWith(expect.any(MouseEvent));
    expect(mockHandler.mock.calls[0]?.[0].target).toBe(button);
  });

  test("returns a function that removes the listener before it runs", () => {
    const mockHandler = vitest.fn();

    const unbind = once(button, "click", mockHandler);
    unbind();
    button.click();

    expect(mockHandler).not.toHaveBeenCalled();
  });

  test("works with the window", () => {
    const mockHandler = vitest.fn();

    once(window, "resize", mockHandler);
    window.dispatchEvent(new Event("resize"));
    window.dispatchEvent(new Event("resize"));

    expect(mockHandler).toHaveBeenCalledTimes(1);
  });

  test("does not affect other listeners of the same event", () => {
    const other = vitest.fn();
    button.addEventListener("click", other);

    once(button, "click", vitest.fn());
    button.click();
    button.click();

    expect(other).toHaveBeenCalledTimes(2);
  });

  test("warns and returns a noop when the element does not exist", () => {
    const consoleSpy = vitest
      .spyOn(console, "warn")
      .mockImplementation(() => {});
    const mockHandler = vitest.fn();

    // @ts-expect-error test wrong implementation
    const unbind = once(null, "click", mockHandler);
    button.click();

    expect(mockHandler).not.toHaveBeenCalled();
    expect(unbind()).toBeUndefined();
    expect(consoleSpy).toHaveBeenCalledWith(
      "[@knitkode/dom:on] unexisting DOM element",
    );

    consoleSpy.mockRestore();
  });
});
