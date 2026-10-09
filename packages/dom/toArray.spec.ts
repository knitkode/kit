import { toArray } from "./toArray";

describe("toArray", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <p class="item">a</p>
      <p class="item">b</p>
      <form id="form">
        <input name="email" />
        <select name="country"></select>
        <button type="submit">send</button>
      </form>
    `;
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("converts a NodeList to an array of the same elements", () => {
    const nodes = document.querySelectorAll<HTMLElement>(".item");

    const result = toArray(nodes);

    expect(Array.isArray(result)).toBe(true);
    expect(result).toEqual([nodes[0], nodes[1]]);
    expect(result.map((el) => el.textContent)).toEqual(["a", "b"]);
  });

  test("converts an empty NodeList to an empty array", () => {
    expect(toArray(document.querySelectorAll(".missing"))).toEqual([]);
  });

  test("converts the controls of a form to an array", () => {
    const form = document.getElementById("form") as HTMLFormElement;

    const result = toArray(form.elements);

    expect(Array.isArray(result)).toBe(true);
    expect(result.map((el) => el.tagName)).toEqual([
      "INPUT",
      "SELECT",
      "BUTTON",
    ]);
  });

  test("returns a copy that does not change with the DOM", () => {
    const form = document.getElementById("form") as HTMLFormElement;
    const result = toArray(form.elements);

    form.querySelector("select")?.remove();

    expect(form.elements).toHaveLength(2);
    expect(result).toHaveLength(3);
  });
});
