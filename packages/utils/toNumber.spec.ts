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
});
