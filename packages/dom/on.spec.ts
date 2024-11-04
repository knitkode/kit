import { jestSetNodeEnv } from "@koine/test/jest";
import { on } from "./on";

describe("on", () => {
  jestSetNodeEnv("development");

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

  test("adds an event listener to a valid element", () => {
    const mockHandler = jest.fn();

    on(button, "click", mockHandler);

    // Simulate a click event
    button.click();

    expect(mockHandler).toHaveBeenCalledTimes(1);
  });

  test("does nothing when the element does not exist", () => {
    const mockHandler = jest.fn();
    const invalidElement = null; // Simulate non-existing element

    // @ts-expect-error test wrong implementation
    const result = on(invalidElement, "click", mockHandler);

    // Ensure the handler is not called
    button.click();
    expect(mockHandler).not.toHaveBeenCalled();
    expect(result()).toBeUndefined(); // Ensure noop is returned
  });

  test("returns an automatic unbinding function", () => {
    const mockHandler = jest.fn();

    const unbind = on(button, "click", mockHandler);

    // Simulate a click event
    button.click();
    expect(mockHandler).toHaveBeenCalledTimes(1);

    // Call the unbinding function
    unbind();

    // Simulate another click event
    button.click();
    expect(mockHandler).toHaveBeenCalledTimes(1); // Should not be called again
  });

  test("logs a warning when trying to add a listener to a non-existing element in development mode", () => {
    const consoleSpy = jest.spyOn(console, "warn").mockImplementation();
    const invalidElement = null;

    // @ts-expect-error test wrong implementation
    on(invalidElement, "click", jest.fn());

    expect(consoleSpy).toHaveBeenCalledWith(
      "[@koine/dom:on] unexisting DOM element",
    );

    consoleSpy.mockRestore(); // Clean up the spy
  });

  test("handles different event types", () => {
    const mockHandler = jest.fn();

    on(window, "resize", mockHandler);

    // Simulate a resize event
    window.dispatchEvent(new Event("resize"));

    expect(mockHandler).toHaveBeenCalledTimes(1);
  });
});
