import { isNaNValue } from "./isNaNValue";

describe("isNaNValue", () => {
  it.each([
    ["NaN", Number.NaN],
    ["the result of 0 / 0", 0 / 0],
    ["a failed Number() conversion", Number("abc")],
  ])("returns true for %s", (_label, payload) => {
    expect(isNaNValue(payload)).toBe(true);
  });

  it.each([
    ["zero", 0],
    ["a number", 1.5],
    ["Infinity", Number.POSITIVE_INFINITY],
    ["the string 'NaN'", "NaN"],
    ["a non-numeric string", "abc"],
    ["undefined", undefined],
    ["null", null],
    ["a plain object", {}],
    ["an array", []],
    ["an invalid Date", new Date("invalid")],
  ])("returns false for %s", (_label, payload) => {
    expect(isNaNValue(payload)).toBe(false);
  });
});
