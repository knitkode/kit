import { isWeakSet } from "./isWeakSet";

describe("isWeakSet", () => {
  it.each([
    ["an empty WeakSet", new WeakSet()],
    ["a WeakSet with values", new WeakSet([{}])],
  ])("returns true for %s", (_label, payload) => {
    expect(isWeakSet(payload)).toBe(true);
  });

  it.each([
    ["a Set", new Set()],
    ["a WeakMap", new WeakMap()],
    ["an array", []],
    ["undefined", undefined],
    ["null", null],
  ])("returns false for %s", (_label, payload) => {
    expect(isWeakSet(payload)).toBe(false);
  });
});
