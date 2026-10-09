import { escapeSelector } from "./escapeSelector";

describe("escapeSelector", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("escapes a colon", () => {
    expect(escapeSelector(".module:block__element")).toBe(
      ".module\\:block__element",
    );
  });

  test("escapes every colon", () => {
    expect(escapeSelector(".a:b:c .d:e")).toBe(".a\\:b\\:c .d\\:e");
  });

  test("returns selectors without colons unchanged", () => {
    expect(escapeSelector("#id > .class[data-x='1']")).toBe(
      "#id > .class[data-x='1']",
    );
    expect(escapeSelector("")).toBe("");
  });

  test("produces a selector that matches class names containing colons", () => {
    document.body.innerHTML = `<div class="module:block__element"></div>`;

    expect(
      document.querySelector(escapeSelector(".module:block__element")),
    ).toBe(document.body.firstElementChild);
  });
});
