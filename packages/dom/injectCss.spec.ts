import { injectCss } from "./injectCss";

describe("injectCss", () => {
  beforeEach(() => {
    document.body.innerHTML = `<main id="main"><p>content</p></main>`;
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("prepends a style element with the given id and css to the body", () => {
    injectCss("theme", "body { color: red; }");

    const style = document.body.firstElementChild;
    expect(style).toBeInstanceOf(HTMLStyleElement);
    expect(style?.id).toBe("theme");
    expect(style?.innerHTML).toBe("body { color: red; }");
  });

  test("updates the existing style element instead of adding another one", () => {
    injectCss("theme", "body { color: red; }");
    injectCss("theme", "body { color: blue; }");

    const styles = document.querySelectorAll("style#theme");
    expect(styles).toHaveLength(1);
    expect(styles[0]?.innerHTML).toBe("body { color: blue; }");
  });

  test("injects an empty style by default", () => {
    injectCss("theme", "body { color: red; }");
    injectCss("theme");

    expect(document.getElementById("theme")?.innerHTML).toBe("");
  });

  test("prepends the style to the given root", () => {
    const root = document.getElementById("main") as HTMLElement;

    injectCss("scoped", "p { margin: 0; }", root);
    injectCss("scoped", "p { margin: 1px; }", root);

    expect(root.querySelectorAll("style")).toHaveLength(1);
    expect(root.firstElementChild?.id).toBe("scoped");
    expect(root.firstElementChild?.innerHTML).toBe("p { margin: 1px; }");
  });

  test("falls back to the body when root is null", () => {
    injectCss("theme", "", null);

    expect(document.body.firstElementChild?.id).toBe("theme");
  });

  test("supports ids containing colons", () => {
    injectCss("theme:dark", "a {}");
    injectCss("theme:dark", "b {}");

    const styles = document.querySelectorAll("style");
    expect(styles).toHaveLength(1);
    expect(styles[0]?.id).toBe("theme:dark");
    expect(styles[0]?.innerHTML).toBe("b {}");
  });
});
