import { isWeakMap } from "./isWeakMap";

describe("isWeakMap", () => {
  it.each([
    ["an empty WeakMap", new WeakMap()],
    ["a WeakMap with entries", new WeakMap([[{}, 1]])],
  ])("returns true for %s", (_label, payload) => {
    expect(isWeakMap(payload)).toBe(true);
  });

  it.each([
    ["a Map", new Map()],
    ["a WeakSet", new WeakSet()],
    ["a plain object", {}],
    ["undefined", undefined],
    ["null", null],
  ])("returns false for %s", (_label, payload) => {
    expect(isWeakMap(payload)).toBe(false);
  });
});
