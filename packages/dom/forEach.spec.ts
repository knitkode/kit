import { forEach } from "./forEach";

describe("forEach", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <p class="item">a</p>
      <p class="item">b</p>
      <p class="item">c</p>
    `;
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("iterates a NodeList passing each element and its index", () => {
    const calls: [string | null, number][] = [];

    forEach(document.querySelectorAll<HTMLElement>(".item"), (el, index) => {
      calls.push([el.textContent, index]);
    });

    expect(calls).toEqual([
      ["a", 0],
      ["b", 1],
      ["c", 2],
    ]);
  });

  test("iterates an array of elements", () => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>(".item"),
    ).reverse();
    const seen: HTMLElement[] = [];

    forEach(elements, (el) => {
      seen.push(el);
    });

    expect(seen).toEqual(elements);
  });

  test("calls the callback with the given scope as `this`", () => {
    const scope = { texts: [] as (string | null)[] };

    forEach(
      document.querySelectorAll<HTMLElement>(".item"),
      function (el) {
        this.texts.push(el.textContent);
      },
      scope,
    );

    expect(scope.texts).toEqual(["a", "b", "c"]);
  });

  test("does not call the callback for an empty collection", () => {
    const callback = vi.fn();

    forEach([], callback);
    forEach(document.querySelectorAll<HTMLElement>(".missing"), callback);

    expect(callback).not.toHaveBeenCalled();
  });
});
