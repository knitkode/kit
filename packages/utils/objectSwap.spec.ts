import { objectSwap } from "./objectSwap";

describe("objectSwap", () => {
  test("swaps keys and values in a simple object", () => {
    const input = { a: "1", b: "2", c: "3" };
    const expectedOutput = { "1": "a", "2": "b", "3": "c" };
    expect(objectSwap(input)).toEqual(expectedOutput);
  });

  test("handles numeric values as values in the object", () => {
    const input = { a: 1, b: 2, c: 3 };
    const expectedOutput = { "1": "a", "2": "b", "3": "c" };
    expect(objectSwap(input)).toEqual(expectedOutput);
  });

  test("handles symbols as values in the object", () => {
    const symA = Symbol("a");
    const symB = Symbol("b");
    const input = { x: symA, y: symB };
    const expectedOutput = { [symA]: "x", [symB]: "y" };
    expect(objectSwap(input)).toEqual(expectedOutput);
  });

  test("returns an empty object when input is empty", () => {
    expect(objectSwap({})).toEqual({});
  });

  test("overwrites keys if values are not unique", () => {
    const input = { a: "1", b: "1", c: "2" };
    const expectedOutput = { "1": "b", "2": "c" }; // 'a' is overwritten by 'b'
    expect(objectSwap(input)).toEqual(expectedOutput);
  });

  test("handles mixed types of values", () => {
    const symA = Symbol("a");
    const input = { a: "1", b: 2, c: symA };
    const expectedOutput = { "1": "a", "2": "b", [symA]: "c" };
    expect(objectSwap(input)).toEqual(expectedOutput);
  });
});
