import { isEmptyArray } from "./isEmptyArray";

describe("isEmptyArray", () => {
  it.each([
    ["an empty array literal", []],
    ["an empty Array constructor result", new Array()],
    ["an emptied array", [1].slice(1)],
  ])("returns true for %s", (_label, payload) => {
    expect(isEmptyArray(payload)).toBe(true);
  });

  it.each([
    ["an array with one item", [1]],
    ["an array with an undefined item", [undefined]],
    ["an array with holes", new Array(3)],
    ["an empty string", ""],
    ["an empty object", {}],
    ["an empty Set", new Set()],
    ["undefined", undefined],
    ["null", null],
  ])("returns false for %s", (_label, payload) => {
    expect(isEmptyArray(payload)).toBe(false);
  });
});
