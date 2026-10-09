import { getDataAttr } from "./getDataAttr";

describe("getDataAttr", () => {
  let el: HTMLDivElement;

  beforeEach(() => {
    el = document.createElement("div");
  });

  test("returns the value of the `data-{attribute}` attribute", () => {
    el.setAttribute("data-id", "42");

    expect(getDataAttr(el, "id")).toBe("42");
  });

  test("reads hyphenated attribute names as they are", () => {
    el.setAttribute("data-user-id", "abc");

    expect(getDataAttr(el, "user-id")).toBe("abc");
  });

  test("returns an empty string for a valueless attribute", () => {
    el.setAttribute("data-flag", "");

    expect(getDataAttr(el, "flag")).toBe("");
  });

  test("returns null when the attribute is missing", () => {
    el.setAttribute("id", "not-a-data-attribute");

    expect(getDataAttr(el, "id")).toBeNull();
  });
});
