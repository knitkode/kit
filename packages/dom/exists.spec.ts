import { exists } from "./exists";

describe("exists", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("returns true for an HTML element in the document", () => {
    document.body.innerHTML = `<div id="node"></div>`;

    expect(exists(document.getElementById("node") ?? undefined)).toBe(true);
  });

  test("returns true for a detached HTML element", () => {
    expect(exists(document.createElement("span"))).toBe(true);
  });

  test("returns a falsy value when no node is given", () => {
    expect(exists()).toBeFalsy();
    expect(exists(undefined)).toBeFalsy();
  });

  test("returns false for elements that are not HTML elements", () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    expect(exists(svg)).toBe(false);
  });
});
