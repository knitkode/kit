import { domAll } from "./domAll";

describe("domAll", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <ul class="list:main">
        <li class="item">1</li>
        <li class="item">2</li>
      </ul>
      <ul class="other">
        <li class="item">3</li>
      </ul>
    `;
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  const texts = (nodes: NodeListOf<Element>) =>
    Array.from(nodes, (node) => node.textContent);

  test("returns every matching element of the document as a NodeList", () => {
    const result = domAll(".item");

    expect(result).toBeInstanceOf(NodeList);
    expect(texts(result)).toEqual(["1", "2", "3"]);
  });

  test("searches within the given parent", () => {
    const parent = document.querySelector(".other");

    expect(texts(domAll(".item", parent))).toEqual(["3"]);
  });

  test("falls back to the document when parent is null", () => {
    expect(domAll(".item", null)).toHaveLength(3);
  });

  test("accepts the document as parent", () => {
    expect(domAll(".item", document)).toHaveLength(3);
  });

  test("escapes colons in the selector by default", () => {
    expect(texts(domAll(".list:main .item"))).toEqual(["1", "2"]);
  });

  test("does not escape colons when avoidEscape is true, allowing pseudo-classes", () => {
    expect(texts(domAll("li:first-child", null, true))).toEqual(["1", "3"]);
    expect(domAll("li:first-child")).toHaveLength(0);
  });

  test("returns an empty NodeList when nothing matches", () => {
    const result = domAll(".missing");

    expect(result).toBeInstanceOf(NodeList);
    expect(result).toHaveLength(0);
  });
});
