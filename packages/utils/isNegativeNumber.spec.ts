import { isNegativeNumber } from "./isNegativeNumber";

describe("isNegativeNumber", () => {
  it.each([
    ["a negative integer", -1],
    ["a negative float", -0.5],
    ["Number.MIN_SAFE_INTEGER", Number.MIN_SAFE_INTEGER],
    ["-Infinity", Number.NEGATIVE_INFINITY],
  ])("returns true for %s", (_label, payload) => {
    expect(isNegativeNumber(payload)).toBe(true);
  });

  it.each([
    ["zero", 0],
    ["negative zero", -0],
    ["a positive number", 1],
    ["Infinity", Number.POSITIVE_INFINITY],
    ["NaN", Number.NaN],
    ["a negative numeric string", "-1"],
    ["undefined", undefined],
    ["null", null],
    ["an array", [-1]],
  ])("returns false for %s", (_label, payload) => {
    expect(isNegativeNumber(payload)).toBe(false);
  });
});
