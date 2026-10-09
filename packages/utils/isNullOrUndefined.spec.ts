import { isNullOrUndefined } from "./isNullOrUndefined";

describe("isNullOrUndefined", () => {
  it.each([
    ["null", null],
    ["undefined", undefined],
  ])("returns true for %s", (_label, payload) => {
    expect(isNullOrUndefined(payload)).toBe(true);
  });

  it.each([
    ["zero", 0],
    ["an empty string", ""],
    ["false", false],
    ["NaN", Number.NaN],
    ["a plain object", {}],
    ["an array", []],
    ["a function", () => null],
  ])("returns false for %s", (_label, payload) => {
    expect(isNullOrUndefined(payload)).toBe(false);
  });
});
