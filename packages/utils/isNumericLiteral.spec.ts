import { isNumericLiteral } from "./isNumericLiteral";

describe("isNumericLiteral", () => {
  test("should return true for positive integers", () => {
    expect(isNumericLiteral("123")).toBe(true);
  });

  test("should return true for negative integers", () => {
    expect(isNumericLiteral("-456")).toBe(true);
  });

  test("should return true for positive floats", () => {
    expect(isNumericLiteral("78.90")).toBe(true);
  });

  test("should return true for negative floats", () => {
    expect(isNumericLiteral("-12.34")).toBe(true);
  });

  test("should return false for zero", () => {
    expect(isNumericLiteral("0")).toBe(true);
  });

  test("should return false for NaN", () => {
    expect(isNumericLiteral("NaN")).toBe(false);
  });

  test("should return false for Infinity", () => {
    expect(isNumericLiteral("Infinity")).toBe(false);
  });

  test("should return false for non-numeric strings", () => {
    expect(isNumericLiteral("abc")).toBe(false);
    expect(isNumericLiteral("12abc")).toBe(false);
    expect(isNumericLiteral("abc12")).toBe(false);
  });

  test("should return false for empty strings", () => {
    expect(isNumericLiteral("")).toBe(false);
  });

  test("should return false for whitespace strings", () => {
    expect(isNumericLiteral(" ")).toBe(false);
    expect(isNumericLiteral("\t")).toBe(false);
    expect(isNumericLiteral("\n")).toBe(false);
  });

  test("should return false for strings with only decimal points", () => {
    expect(isNumericLiteral(".")).toBe(false);
    expect(isNumericLiteral("-.")).toBe(false);
    expect(isNumericLiteral("-.5")).toBe(false);
  });

  test("should return false for strings with multiple decimal points", () => {
    expect(isNumericLiteral("1.2.3")).toBe(false);
  });

  test("should return false for strings with leading/trailing spaces", () => {
    expect(isNumericLiteral(" 123 ")).toBe(false);
    expect(isNumericLiteral("-456 ")).toBe(false);
    expect(isNumericLiteral(" 78.90")).toBe(false);
  });
});
