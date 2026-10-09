import { toNumber } from "./toNumber";

describe("toNumber", () => {
  test("returns the input if it is a valid number", () => {
    expect(toNumber(42)).toBe(42);
    expect(toNumber(-7)).toBe(-7);
    expect(toNumber(0)).toBe(0);
  });

  test("parses a valid string representation of a number", () => {
    expect(toNumber("42")).toBe(42);
    expect(toNumber("-7")).toBe(-7);
    expect(toNumber("3.14")).toBe(3.14);
  });

  test("returns fallback if input is NaN", () => {
    expect(toNumber(NaN, 5)).toBe(5);
    expect(toNumber(NaN)).toBe(0); // Default fallback
  });

  test("returns fallback if input is undefined or empty string", () => {
    expect(toNumber(undefined, 10)).toBe(10);
    expect(toNumber(undefined)).toBe(0); // Default fallback
    expect(toNumber("", 20)).toBe(20);
    expect(toNumber("")).toBe(0); // Default fallback
  });

  test("returns 0 if no valid input or fallback is provided", () => {
    expect(toNumber(null)).toBe(0); // Default fallback
    expect(toNumber(undefined)).toBe(0); // Default fallback
  });

  test("parses number with fallback provided", () => {
    expect(toNumber("100", 50)).toBe(100); // ignores fallback
    expect(toNumber(200, 50)).toBe(200); // ignores fallback
  });

  test("returns fallback for invalid string inputs", () => {
    expect(toNumber("abc", 5)).toBe(5);
    expect(toNumber("NaN", 8)).toBe(8);
  });

  test("returns Infinity untouched", () => {
    expect(toNumber(Number.POSITIVE_INFINITY)).toBe(Number.POSITIVE_INFINITY);
    expect(toNumber(Number.NEGATIVE_INFINITY, 1)).toBe(
      Number.NEGATIVE_INFINITY,
    );
  });

  test("parses strings with surrounding whitespace", () => {
    expect(toNumber("  42  ")).toBe(42);
    expect(toNumber("\n-1.5\t")).toBe(-1.5);
  });

  test("parses the leading number of a string", () => {
    expect(toNumber("12px")).toBe(12);
    expect(toNumber("3.5rem", 1)).toBe(3.5);
  });

  test("parses exponent and decimal-only notations", () => {
    expect(toNumber("1e3")).toBe(1000);
    expect(toNumber(".5")).toBe(0.5);
    expect(toNumber("0")).toBe(0);
  });

  test("returns 0 for invalid strings without a fallback", () => {
    expect(toNumber("abc")).toBe(0);
    expect(toNumber("px12")).toBe(0);
  });
});
