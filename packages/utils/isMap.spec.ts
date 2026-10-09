import { isMap } from "./isMap";

describe("isMap", () => {
  it.each([
    ["an empty Map", new Map()],
    ["a Map with entries", new Map([["a", 1]])],
  ])("returns true for %s", (_label, payload) => {
    expect(isMap(payload)).toBe(true);
  });

  it.each([
    ["a WeakMap", new WeakMap()],
    ["a Set", new Set()],
    ["a plain object", {}],
    ["an array of entries", [["a", 1]]],
    ["undefined", undefined],
    ["null", null],
  ])("returns false for %s", (_label, payload) => {
    expect(isMap(payload)).toBe(false);
  });
});
