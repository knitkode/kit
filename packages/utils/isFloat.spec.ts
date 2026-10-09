import { isFloat } from "./isFloat";

describe("isFloat", () => {
  it.each([
    ["a positive float", 1.5],
    ["a negative float", -0.1],
    ["Number.EPSILON", Number.EPSILON],
    ["the result of 0.1 + 0.2", 0.1 + 0.2],
  ])("returns true for %s", (_label, payload) => {
    expect(isFloat(payload)).toBe(true);
  });

  it.each([
    ["zero", 0],
    ["a positive integer", 1],
    ["a negative integer", -42],
    ["a float literal without decimals", 1.0],
    ["NaN", Number.NaN],
    ["Infinity", Number.POSITIVE_INFINITY],
    ["-Infinity", Number.NEGATIVE_INFINITY],
    ["a float string", "1.5"],
    ["undefined", undefined],
    ["null", null],
    ["a boolean", true],
    ["an array", [1.5]],
  ])("returns false for %s", (_label, payload) => {
    expect(isFloat(payload)).toBe(false);
  });
});
