import { getHeight } from "./getHeight";

describe("getHeight", () => {
  afterEach(() => {
    document.head.innerHTML = "";
    document.body.innerHTML = "";
  });

  test("returns the computed height in pixels as an integer", () => {
    document.body.innerHTML = `<div style="height: 120px"></div>`;

    expect(getHeight(document.body.firstElementChild as Element)).toBe(120);
  });

  test("truncates fractional heights", () => {
    document.body.innerHTML = `<div style="height: 80.9px"></div>`;

    expect(getHeight(document.body.firstElementChild as Element)).toBe(80);
  });

  test("reads heights set by stylesheets", () => {
    document.head.innerHTML = `<style>#box { height: 50px; }</style>`;
    document.body.innerHTML = `<div id="box"></div>`;

    expect(getHeight(document.getElementById("box") as Element)).toBe(50);
  });
});
