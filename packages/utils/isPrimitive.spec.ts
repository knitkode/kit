import { isPrimitive } from "./isPrimitive";

describe("isPrimitive", () => {
  it.each([
    ["true", true],
    ["false", false],
    ["null", null],
    ["undefined", undefined],
    ["zero", 0],
    ["a float", 1.5],
    ["Infinity", Number.POSITIVE_INFINITY],
    ["an empty string", ""],
    ["a string", "abc"],
    ["a symbol", Symbol("s")],
  ])("returns true for %s", (_label, payload) => {
    expect(isPrimitive(payload)).toBe(true);
  });

  it.each([
    ["a plain object", {}],
    ["an array", []],
    ["a function", () => 1],
    ["a Date", new Date()],
    ["a Map", new Map()],
    ["a RegExp", /a/],
    ["a Promise", Promise.resolve()],
  ])("returns false for %s", (_label, payload) => {
    expect(isPrimitive(payload)).toBe(false);
  });
});
