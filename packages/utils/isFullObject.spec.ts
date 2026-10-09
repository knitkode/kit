import { isFullObject } from "./isFullObject";

class Foo {
  a = 1;
}

describe("isFullObject", () => {
  it.each([
    ["an object with a property", { a: 1 }],
    ["an object with an undefined property", { a: undefined }],
    ["an object with nested values", { a: { b: [1] } }],
  ])("returns true for %s", (_label, payload) => {
    expect(isFullObject(payload)).toBe(true);
  });

  it.each([
    ["an empty object", {}],
    ["a class instance with properties", new Foo()],
    ["an array with items", [1]],
    ["a Map with entries", new Map([["a", 1]])],
    ["a non-empty string", "abc"],
    ["undefined", undefined],
    ["null", null],
  ])("returns false for %s", (_label, payload) => {
    expect(isFullObject(payload)).toBe(false);
  });
});
