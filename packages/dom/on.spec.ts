import { vitestSetNodeEnv } from "@knitkode/test/vitest";
import { on } from "./on";

describe("on", () => {
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

  test("adds an event listener to a valid element", () => {
    const mockHandler = vitest.fn();

    on(button, "click", mockHandler);

    // Simulate a click event
    button.click();

    expect(mockHandler).toHaveBeenCalledTimes(1);
  });

  test("does nothing when the element does not exist", () => {
    const mockHandler = vitest.fn();
    const invalidElement = null; // Simulate non-existing element

    // @ts-expect-error test wrong implementation
    const result = on(invalidElement, "click", mockHandler);

    // Ensure the handler is not called
    button.click();
    expect(mockHandler).not.toHaveBeenCalled();
    expect(result()).toBeUndefined(); // Ensure noop is returned
  });

  test("returns an automatic unbinding function", () => {
    const mockHandler = vitest.fn();

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

  test.each([
    ["`true`", true],
    ["`{ capture: true, passive: true }`", { capture: true, passive: true }],
  ])(
    "returns an unbinding function that removes a listener added with %s as options",
    (_label, options) => {
      const mockHandler = vitest.fn();

      const unbind = on(button, "click", mockHandler, options);
      unbind();
      button.click();

      expect(mockHandler).not.toHaveBeenCalled();
    },
  );

  test("logs a warning when trying to add a listener to a non-existing element in development mode", () => {
    const consoleSpy = vitest
      .spyOn(console, "warn")
      .mockImplementation(() => {});
    const invalidElement = null;

    // @ts-expect-error test wrong implementation
    on(invalidElement, "click", vitest.fn());

    expect(consoleSpy).toHaveBeenCalledWith(
      "[@knitkode/dom:on] unexisting DOM element",
    );

    consoleSpy.mockRestore(); // Clean up the spy
  });

  test("handles different event types", () => {
    const mockHandler = vitest.fn();

    on(window, "resize", mockHandler);

    // Simulate a resize event
    window.dispatchEvent(new Event("resize"));

    expect(mockHandler).toHaveBeenCalledTimes(1);
  });

  test("passes the event to the handler", () => {
    const mockHandler = vitest.fn();

    on(button, "click", mockHandler);
    button.click();

    expect(mockHandler).toHaveBeenCalledWith(expect.any(MouseEvent));
    expect(mockHandler.mock.calls[0]?.[0].target).toBe(button);
  });

  test("forwards the options to addEventListener", () => {
    const mockHandler = vitest.fn();

    on(button, "click", mockHandler, { once: true });
    button.click();
    button.click();

    expect(mockHandler).toHaveBeenCalledTimes(1);
  });

  test("registers the listener in the capture phase with `true` as options", () => {
    const calls: string[] = [];
    const parent = document.createElement("div");
    parent.appendChild(button);
    document.body.appendChild(parent);

    on(button, "click", () => calls.push("target"));
    on(parent, "click", () => calls.push("parent bubble"));
    on(parent, "click", () => calls.push("parent capture"), true);
    button.click();

    expect(calls).toEqual(["parent capture", "target", "parent bubble"]);
  });
});

describe("on outside development", () => {
  vitestSetNodeEnv("production");

  test("silently returns a noop for a non-existing element", () => {
    const consoleSpy = vitest
      .spyOn(console, "warn")
      .mockImplementation(() => {});

    // @ts-expect-error test wrong implementation
    const unbind = on(undefined, "click", vitest.fn());

    expect(unbind()).toBeUndefined();
    expect(consoleSpy).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
