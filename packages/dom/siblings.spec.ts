import { siblings } from "./siblings";

describe("siblings", () => {
  const $ = (selector: string) => {
    const el = document.querySelector<HTMLElement>(selector);
    if (!el) throw new Error(`missing fixture ${selector}`);
    return el;
  };

  beforeEach(() => {
    document.body.innerHTML = `
      <ul>
        text
        <li id="first"></li>
        <!-- comment -->
        <li id="middle"></li>
        <li id="last"></li>
      </ul>
      <div id="parent"><span id="only"></span></div>
    `;
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("returns the sibling elements in document order, excluding the node", () => {
    expect(siblings($("#middle"))).toEqual([$("#first"), $("#last")]);
  });

  test("ignores text and comment nodes", () => {
    const result = siblings($("#first"));

    expect(result).toEqual([$("#middle"), $("#last")]);
    expect(result.every((node) => node.nodeType === Node.ELEMENT_NODE)).toBe(
      true,
    );
  });

  test("returns an empty array for an only child", () => {
    expect(siblings($("#only"))).toEqual([]);
  });

  test("returns an empty array for a node without parent", () => {
    expect(siblings(document.createElement("div"))).toEqual([]);
  });
});
