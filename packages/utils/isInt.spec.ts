import { isInt } from "./isInt";

describe("isInt", () => {
  it.each([
    ["zero", 0],
    ["a positive integer", 1],
    ["a negative integer", -42],
    ["a float literal without decimals", 1.0],
    ["an exponent literal", 1e3],
    ["Number.MAX_SAFE_INTEGER", Number.MAX_SAFE_INTEGER],
    ["Number.MIN_SAFE_INTEGER", Number.MIN_SAFE_INTEGER],
  ])("returns true for %s", (_label, payload) => {
    expect(isInt(payload)).toBe(true);
  });

  it.each([
    ["a positive float", 1.5],
    ["a negative float", -0.1],
    ["NaN", Number.NaN],
    ["Infinity", Number.POSITIVE_INFINITY],
    ["-Infinity", Number.NEGATIVE_INFINITY],
    ["an integer string", "1"],
    ["a bigint", 1n],
    ["undefined", undefined],
    ["null", null],
    ["a boolean", true],
    ["an array", [1]],
  ])("returns false for %s", (_label, payload) => {
    expect(isInt(payload)).toBe(false);
  });
});
