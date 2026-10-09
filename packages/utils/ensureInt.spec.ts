import { ensureInt } from "./ensureInt";

describe("ensureInt", () => {
  it.each([
    [42, 42],
    [0, 0],
    [-7, -7],
    [4.4, 4],
    [4.6, 4],
    [-4.6, -4],
    [1.9, 1],
  ])("truncates the number %d to %d", (input, expected) => {
    expect(ensureInt(input)).toBe(expected);
  });

  it.each([
    ["42", 42],
    ["0", 0],
    ["-7", -7],
    ["007", 7],
    ["12px", 12],
    ["  3", 3],
  ])("parses the string %j to %d", (input, expected) => {
    expect(ensureInt(input)).toBe(expected);
  });

  it("always returns an integer for numeric input", () => {
    for (const input of [1.1, 2.5, "3", "-4", 99.99]) {
      expect(Number.isInteger(ensureInt(input))).toBe(true);
    }
  });

  it("drops the decimals of numbers and strings the same way", () => {
    expect(ensureInt(1.9)).toBe(ensureInt("1.9"));
    expect(ensureInt(-1.9)).toBe(ensureInt("-1.9"));
  });

  it("returns NaN for non numeric input", () => {
    expect(ensureInt("abc")).toBeNaN();
    expect(ensureInt("")).toBeNaN();
  });
});
