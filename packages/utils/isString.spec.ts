import { isString } from "./isString";

describe("isString", () => {
  it.each([
    ["an empty string", ""],
    ["a whitespace string", " "],
    ["a word", "abc"],
    ["a numeric string", "123"],
    ["a unicode string", "àèì 世界 👋"],
    ["a String() call result", String(123)],
  ])("returns true for %s", (_label, payload) => {
    expect(isString(payload)).toBe(true);
  });

  it.each([
    ["undefined", undefined],
    ["null", null],
    ["a number", 1],
    ["NaN", Number.NaN],
    ["a boolean", true],
    ["a symbol", Symbol("abc")],
    ["an array of strings", ["a", "b"]],
    ["a plain object", { toString: () => "a" }],
    ["a function", () => "a"],
  ])("returns false for %s", (_label, payload) => {
    expect(isString(payload)).toBe(false);
  });
});
