import { domEach } from "./domEach";

describe("domEach", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="group:a">
        <span class="item">1</span>
        <span class="item">2</span>
      </div>
      <div class="group-b">
        <span class="item">3</span>
      </div>
    `;
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("calls the callback with each matching element and its index", () => {
    const calls: [string | null, number][] = [];

    domEach(".item", (el, index) => {
      calls.push([el.textContent, index]);
    });

    expect(calls).toEqual([
      ["1", 0],
      ["2", 1],
      ["3", 2],
    ]);
  });

  test("only iterates the elements within the given parent", () => {
    const calls: (string | null)[] = [];

    domEach(
      ".item",
      (el) => {
        calls.push(el.textContent);
      },
      document.querySelector(".group-b"),
    );

    expect(calls).toEqual(["3"]);
  });

  test("escapes colons in the selector", () => {
    const callback = vi.fn();

    domEach(".group:a .item", callback);

    expect(callback).toHaveBeenCalledTimes(2);
  });

  test("calls the callback with the given scope as `this`", () => {
    const scope = { seen: [] as (string | null)[] };

    domEach(
      ".item",
      function (this: typeof scope, el) {
        this.seen.push(el.textContent);
      },
      null,
      scope,
    );

    expect(scope.seen).toEqual(["1", "2", "3"]);
  });

  test("does not call the callback when nothing matches", () => {
    const callback = vi.fn();

    domEach(".missing", callback);

    expect(callback).not.toHaveBeenCalled();
  });
});
