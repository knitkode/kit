import { isFullArray } from "./isFullArray";

describe("isFullArray", () => {
  it.each([
    ["an array with one item", [1]],
    ["an array with an undefined item", [undefined]],
    ["an array with many items", ["a", "b", "c"]],
  ])("returns true for %s", (_label, payload) => {
    expect(isFullArray(payload)).toBe(true);
  });

  it.each([
    ["an empty array", []],
    ["a non-empty string", "abc"],
    ["an array-like object", { 0: "a", length: 1 }],
    ["a Set with values", new Set([1])],
    ["undefined", undefined],
    ["null", null],
  ])("returns false for %s", (_label, payload) => {
    expect(isFullArray(payload)).toBe(false);
  });
});
