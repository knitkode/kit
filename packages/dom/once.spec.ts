import { vitestSetNodeEnv } from "@koine/test/vitest";
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

  // test("does nothing when the element does not exist", () => {
  //   const mockHandler = vitest.fn();
  //   const invalidElement = null; // Simulate non-existing element

  //   // Call `once` with a non-existing element
  //   // @ts-expect-error test wrong implementation
  //   once(invalidElement, "click", mockHandler);

  //   // Ensure the handler is still not called
  //   button.click();
  //   expect(mockHandler).not.toHaveBeenCalled();
  // });

  // test("logs a warning when trying to add a listener to a non-existing element in development mode", () => {
  //   const consoleSpy = vitest.spyOn(console, "warn").mockImplementation();
  //   const invalidElement = null;

  //   // @ts-expect-error test wrong implementation
  //   once(invalidElement, "click", vitest.fn());

  //   expect(consoleSpy).toHaveBeenCalledWith(
  //     "[@koine/dom:on] unexisting DOM element",
  //   );

  //   consoleSpy.mockRestore(); // Clean up the spy
  // });
});
