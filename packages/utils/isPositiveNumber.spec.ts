import { isPositiveNumber } from "./isPositiveNumber";

describe("isPositiveNumber", () => {
  it.each([
    ["a positive integer", 1],
    ["a positive float", 0.5],
    ["Number.MIN_VALUE", Number.MIN_VALUE],
    ["Infinity", Number.POSITIVE_INFINITY],
  ])("returns true for %s", (_label, payload) => {
    expect(isPositiveNumber(payload)).toBe(true);
  });

  it.each([
    ["zero", 0],
    ["negative zero", -0],
    ["a negative number", -1],
    ["-Infinity", Number.NEGATIVE_INFINITY],
    ["NaN", Number.NaN],
    ["a positive numeric string", "1"],
    ["undefined", undefined],
    ["null", null],
    ["an array", [1]],
  ])("returns false for %s", (_label, payload) => {
    expect(isPositiveNumber(payload)).toBe(false);
  });
});
