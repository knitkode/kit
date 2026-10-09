import { isNumber } from "./isNumber";

describe("isNumber", () => {
  it.each([
    ["zero", 0],
    ["negative zero", -0],
    ["a positive integer", 1],
    ["a negative integer", -1],
    ["a float", 1.5],
    ["Infinity", Number.POSITIVE_INFINITY],
    ["-Infinity", Number.NEGATIVE_INFINITY],
    ["Number.MAX_SAFE_INTEGER", Number.MAX_SAFE_INTEGER],
    ["Number.EPSILON", Number.EPSILON],
  ])("returns true for %s", (_label, payload) => {
    expect(isNumber(payload)).toBe(true);
  });

  it.each([
    ["NaN", Number.NaN],
    ["undefined", undefined],
    ["null", null],
    ["a numeric string", "1"],
    ["an empty string", ""],
    ["a bigint", 1n],
    ["a boolean", true],
    ["an array", [1]],
    ["a plain object", {}],
    ["a Date", new Date()],
  ])("returns false for %s", (_label, payload) => {
    expect(isNumber(payload)).toBe(false);
  });
});
