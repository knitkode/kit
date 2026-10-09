import { getStyleValue } from "./getStyleValue";

describe("getStyleValue", () => {
  const $ = (selector: string) => {
    const el = document.querySelector<HTMLElement>(selector);
    if (!el) throw new Error(`missing fixture ${selector}`);
    return el;
  };

  afterEach(() => {
    document.head.innerHTML = "";
    document.body.innerHTML = "";
  });

  test("returns the computed value of an inline style property", () => {
    document.body.innerHTML = `<div id="box" style="margin-top: 12px; display: none"></div>`;

    expect(getStyleValue($("#box"), "margin-top")).toBe("12px");
    expect(getStyleValue($("#box"), "display")).toBe("none");
  });

  test("returns the computed value of a property set by a stylesheet", () => {
    document.head.innerHTML = `<style>.box { padding-left: 4px; }</style>`;
    document.body.innerHTML = `<div id="box" class="box"></div>`;

    expect(getStyleValue($("#box"), "padding-left")).toBe("4px");
  });

  test("returns the resolved value rather than the declared one", () => {
    document.body.innerHTML = `<div id="box" style="color: red"></div>`;

    expect(getStyleValue($("#box"), "color")).toBe("rgb(255, 0, 0)");
  });

  test("returns the default computed value of an unset property", () => {
    document.body.innerHTML = `<div id="box"></div>`;

    expect(getStyleValue($("#box"), "display")).toBe("block");
  });
});
