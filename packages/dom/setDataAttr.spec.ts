import { setDataAttr } from "./setDataAttr";

describe("setDataAttr", () => {
  let el: HTMLDivElement;

  beforeEach(() => {
    el = document.createElement("div");
  });

  test("sets the `data-{attribute}` attribute", () => {
    setDataAttr(el, "state", "open");

    expect(el.getAttribute("data-state")).toBe("open");
    expect(el.dataset["state"]).toBe("open");
  });

  test("overwrites an existing value", () => {
    el.setAttribute("data-state", "open");

    setDataAttr(el, "state", "closed");

    expect(el.getAttribute("data-state")).toBe("closed");
  });

  test.each([
    [3, "3"],
    [0, "0"],
    [true, "true"],
    [false, "false"],
    ["", ""],
  ])("stringifies the value %j", (value, expected) => {
    setDataAttr(el, "value", value);

    expect(el.getAttribute("data-value")).toBe(expected);
  });

  test("removes the attribute when the value is null", () => {
    el.setAttribute("data-state", "open");

    setDataAttr(el, "state", null);

    expect(el.hasAttribute("data-state")).toBe(false);
  });

  test("removes the attribute when the value is undefined or omitted", () => {
    el.setAttribute("data-a", "1");
    el.setAttribute("data-b", "2");

    setDataAttr(el, "a", undefined);
    setDataAttr(el, "b");

    expect(el.hasAttribute("data-a")).toBe(false);
    expect(el.hasAttribute("data-b")).toBe(false);
  });

  test("works with non HTML elements", () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    setDataAttr(svg, "icon", "close");

    expect(svg.getAttribute("data-icon")).toBe("close");
  });
});
