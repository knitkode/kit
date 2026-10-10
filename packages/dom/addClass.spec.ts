import { vitestSetNodeEnv } from "@knitkode/test/vitest";
import { addClass } from "./addClass";

describe("addClass", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("adds the class to the element", () => {
    const el = document.createElement("div");

    addClass(el, "active");

    expect(el.classList.contains("active")).toBe(true);
  });

  test("keeps the classes the element already has", () => {
    const el = document.createElement("div");
    el.className = "a b";

    addClass(el, "c");

    expect(el.className).toBe("a b c");
  });

  test("does not duplicate a class the element already has", () => {
    const el = document.createElement("div");
    el.className = "active";

    addClass(el, "active");

    expect(el.className).toBe("active");
  });

  test.each([
    ["without", undefined],
    ["with an empty", ""],
  ])("does nothing %s class name", (_label, className) => {
    const el = document.createElement("div");
    el.className = "a";

    expect(() => addClass(el, className)).not.toThrow();
    expect(el.className).toBe("a");
  });

  test("works with non HTML elements", () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    addClass(svg, "icon");

    expect(svg.getAttribute("class")).toBe("icon");
  });

  describe("in development", () => {
    vitestSetNodeEnv("development");

    test("warns and bails out when the element does not exist", () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

      expect(addClass(undefined, "active")).toBeUndefined();
      expect(warn).toHaveBeenCalledWith(
        "[@knitkode/dom:addClass] unexisting DOM element",
      );
    });

    test("does not warn when the element exists", () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      const el = document.createElement("div");

      addClass(el, "active");

      expect(el.classList.contains("active")).toBe(true);
      expect(warn).not.toHaveBeenCalled();
    });
  });

  describe("in production", () => {
    vitestSetNodeEnv("production");

    test("silently ignores a missing element", () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

      expect(() => addClass(undefined, "active")).not.toThrow();
      expect(warn).not.toHaveBeenCalled();
    });
  });
});
