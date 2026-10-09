import { isFullString } from "./isFullString";

describe("isFullString", () => {
  it.each([
    ["a word", "abc"],
    ["a whitespace string", " "],
    ["the string '0'", "0"],
    ["a unicode string", "世界"],
  ])("returns true for %s", (_label, payload) => {
    expect(isFullString(payload)).toBe(true);
  });

  it.each([
    ["an empty string", ""],
    ["a number", 1],
    ["undefined", undefined],
    ["null", null],
    ["an array of strings", ["a"]],
    ["a plain object", {}],
  ])("returns false for %s", (_label, payload) => {
    expect(isFullString(payload)).toBe(false);
  });
});
