import { isArray } from "./isArray";

describe("isArray", () => {
  it.each([
    ["an empty array", []],
    ["an array of numbers", [1, 2, 3]],
    ["a nested array", [[1], [2]]],
    ["an Array constructor result", new Array(3)],
    ["an Array.from result", Array.from("abc")],
  ])("returns true for %s", (_label, payload) => {
    expect(isArray(payload)).toBe(true);
  });

  it.each([
    ["undefined", undefined],
    ["null", null],
    ["a string", "abc"],
    ["a number", 3],
    ["a plain object", {}],
    ["an array-like object", { length: 0 }],
    ["a typed array", new Uint8Array(2)],
    ["a Set", new Set([1])],
    ["a Map", new Map()],
    ["a function", () => []],
  ])("returns false for %s", (_label, payload) => {
    expect(isArray(payload)).toBe(false);
  });
});
