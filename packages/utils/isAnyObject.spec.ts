import { isAnyObject } from "./isAnyObject";

class Foo {
  a = 1;
}

describe("isAnyObject", () => {
  it.each([
    ["an empty object", {}],
    ["an object with properties", { a: 1 }],
    ["a class instance", new Foo()],
    ["an object with a custom prototype", Object.create({ a: 1 })],
    ["a null-prototype object", Object.create(null)],
  ])("returns true for %s", (_label, payload) => {
    expect(isAnyObject(payload)).toBe(true);
  });

  it.each([
    ["an array", []],
    ["a function", () => ({})],
    ["a string", "abc"],
    ["a number", 1],
    ["a boolean", true],
    ["undefined", undefined],
    ["null", null],
  ])("returns false for %s", (_label, payload) => {
    expect(isAnyObject(payload)).toBe(false);
  });
});
