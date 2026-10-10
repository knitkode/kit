import { isNodeList } from "./isNodeList";

describe("isNodeList", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <ul id="list"><li>1</li><li>2</li></ul>
      <p>text <b>bold</b></p>
    `;
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("returns true for a NodeList of elements", () => {
    expect(isNodeList(document.querySelectorAll("li"))).toBe(true);
  });

  test("returns true for an empty NodeList", () => {
    expect(isNodeList(document.querySelectorAll(".missing"))).toBe(true);
  });

  test("returns true for a NodeList starting with a text node", () => {
    const p = document.querySelector("p") as HTMLParagraphElement;

    expect(p.childNodes[0]?.nodeType).toBe(Node.TEXT_NODE);
    expect(isNodeList(p.childNodes)).toBe(true);
  });

  test("returns true for an HTMLCollection", () => {
    expect(isNodeList(document.getElementsByTagName("li"))).toBe(true);
    expect(
      isNodeList((document.getElementById("list") as HTMLElement).children),
    ).toBe(true);
  });

  test("returns false for an array of elements", () => {
    expect(isNodeList(Array.from(document.querySelectorAll("li")))).toBe(false);
    expect(isNodeList([])).toBe(false);
  });

  test("returns false for a single element", () => {
    expect(isNodeList(document.body)).toBe(false);
  });

  test.each([
    ["null", null],
    ["undefined", undefined],
    ["a string", "li"],
    ["a number", 2],
    ["a function", () => {}],
  ])("returns false for %s", (_label, value) => {
    expect(isNodeList(value)).toBe(false);
  });

  test("returns false for array-like plain objects", () => {
    expect(isNodeList({ length: 0 })).toBe(false);
    expect(isNodeList({ length: 1, 0: document.body })).toBe(false);
    expect(isNodeList({ length: 1, 0: "li" })).toBe(false);
  });

  test("returns false for a fake NodeList without nodes", () => {
    const fake = (props: object) => ({
      [Symbol.toStringTag]: "NodeList",
      ...props,
    });

    expect(isNodeList(fake({}))).toBe(false);
    expect(isNodeList(fake({ length: 1, 0: "li" }))).toBe(false);
    expect(isNodeList(fake({ length: 1, 0: { nodeType: 0 } }))).toBe(false);
  });
});
