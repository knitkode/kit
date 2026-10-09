import { isRegExp } from "./isRegExp";

describe("isRegExp", () => {
  it.each([
    ["a regex literal", /a+/],
    ["a regex literal with flags", /a/giu],
    ["a RegExp constructor result", new RegExp("a", "g")],
  ])("returns true for %s", (_label, payload) => {
    expect(isRegExp(payload)).toBe(true);
  });

  it.each([
    ["a regex-like string", "/a+/"],
    ["a regex-like object", { source: "a", flags: "g" }],
    ["undefined", undefined],
    ["null", null],
    ["an array", []],
  ])("returns false for %s", (_label, payload) => {
    expect(isRegExp(payload)).toBe(false);
  });
});
