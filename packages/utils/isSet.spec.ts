import { isSet } from "./isSet";

describe("isSet", () => {
  it.each([
    ["an empty Set", new Set()],
    ["a Set with values", new Set([1, 2])],
  ])("returns true for %s", (_label, payload) => {
    expect(isSet(payload)).toBe(true);
  });

  it.each([
    ["a WeakSet", new WeakSet()],
    ["a Map", new Map()],
    ["an array", [1, 2]],
    ["a plain object", {}],
    ["undefined", undefined],
    ["null", null],
  ])("returns false for %s", (_label, payload) => {
    expect(isSet(payload)).toBe(false);
  });
});
