import { isEmptyString } from "./isEmptyString";

describe("isEmptyString", () => {
  it.each([
    ["an empty string literal", ""],
    ["an empty template literal", ``],
    ["an empty String() call result", String("")],
  ])("returns true for %s", (_label, payload) => {
    expect(isEmptyString(payload)).toBe(true);
  });

  it.each([
    ["a whitespace string", " "],
    ["a non-empty string", "a"],
    ["zero", 0],
    ["false", false],
    ["undefined", undefined],
    ["null", null],
    ["an empty array", []],
  ])("returns false for %s", (_label, payload) => {
    expect(isEmptyString(payload)).toBe(false);
  });
});
