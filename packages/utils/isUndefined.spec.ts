import { isUndefined } from "./isUndefined";

describe("isUndefined", () => {
  it.each([
    ["undefined", undefined],
    ["a missing object property", ({} as { a?: number }).a],
    ["the result of a function returning nothing", (() => {})()],
  ])("returns true for %s", (_label, payload) => {
    expect(isUndefined(payload)).toBe(true);
  });

  it.each([
    ["null", null],
    ["zero", 0],
    ["an empty string", ""],
    ["the string 'undefined'", "undefined"],
    ["false", false],
    ["NaN", Number.NaN],
    ["a plain object", {}],
    ["an array", []],
  ])("returns false for %s", (_label, payload) => {
    expect(isUndefined(payload)).toBe(false);
  });
});
