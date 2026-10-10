import { vitestSetNodeEnv } from "@knitkode/test/vitest";
import { removeClass } from "./removeClass";

describe("removeClass", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("removes the class from the element", () => {
    const el = document.createElement("div");
    el.className = "a active b";

    removeClass(el, "active");

    expect(el.className).toBe("a b");
  });

  test("does nothing when the element does not have the class", () => {
    const el = document.createElement("div");
    el.className = "a b";

    removeClass(el, "missing");

    expect(el.className).toBe("a b");
  });

  test.each([
    ["without", undefined],
    ["with an empty", ""],
  ])("does nothing %s class name", (_label, className) => {
    const el = document.createElement("div");
    el.className = "a";

    expect(() => removeClass(el, className)).not.toThrow();
    expect(el.className).toBe("a");
  });

  test("works with non HTML elements", () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "icon active");

    removeClass(svg, "active");

    expect(svg.getAttribute("class")).toBe("icon");
  });

  describe("in development", () => {
    vitestSetNodeEnv("development");

    test("warns and bails out when the element does not exist", () => {
      const log = vi.spyOn(console, "log").mockImplementation(() => {});
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

      expect(removeClass(undefined, "active")).toBeUndefined();
      expect(warn).toHaveBeenCalledWith(
        "[@knitkode/dom:removeClass] unexisting DOM element",
      );
      expect(log).not.toHaveBeenCalled();
    });
  });

  describe("in production", () => {
    vitestSetNodeEnv("production");

    test("silently ignores a missing element", () => {
      const log = vi.spyOn(console, "log").mockImplementation(() => {});
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

      expect(() => removeClass(undefined, "active")).not.toThrow();
      expect(log).not.toHaveBeenCalled();
      expect(warn).not.toHaveBeenCalled();
    });
  });
});
