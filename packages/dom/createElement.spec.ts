import { createElement } from "./createElement";

describe("createElement", () => {
  test("creates a detached element of the given type", () => {
    const el = createElement("section");

    expect(el).toBeInstanceOf(HTMLElement);
    expect(el.tagName).toBe("SECTION");
    expect(el.parentNode).toBeNull();
  });

  test("returns the specific element type for known tags", () => {
    const input = createElement("input");

    expect(input).toBeInstanceOf(HTMLInputElement);
    input.value = "typed";
    expect(input.value).toBe("typed");
  });

  test("adds the given className", () => {
    const el = createElement("div", "card");

    expect(el.className).toBe("card");
  });

  test("does not set a class attribute without className", () => {
    expect(createElement("div").hasAttribute("class")).toBe(false);
    expect(createElement("div", "").hasAttribute("class")).toBe(false);
  });

  test("creates custom elements", () => {
    const el = createElement("my-widget", "widget");

    expect(el.tagName).toBe("MY-WIDGET");
    expect(el.classList.contains("widget")).toBe(true);
  });
});
