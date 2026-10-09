import * as starImport from "./fixtures";
import { isPlainObject } from "./isPlainObject";

class Foo {}

describe("isPlainObject", () => {
  it("works with plain object literal", () => {
    expect(isPlainObject({})).toEqual(true);
  });

  it("works with star import", () => {
    expect(isPlainObject(starImport)).toEqual(true);
  });

  it.each([
    ["an object with properties", { a: 1, b: { c: 2 } }],
    ["an Object() call result", new Object()],
    ["a JSON.parse result", JSON.parse('{"a":1}')],
    ["an Object.assign result", Object.assign({}, { a: 1 })],
  ])("returns true for %s", (_label, payload) => {
    expect(isPlainObject(payload)).toBe(true);
  });

  it.each([
    ["a class instance", new Foo()],
    ["an object with a custom prototype", Object.create({ a: 1 })],
    ["an array", [1]],
    ["a Date", new Date()],
    ["a Map", new Map()],
    ["a Set", new Set()],
    ["a RegExp", /a/],
    ["a function", () => ({})],
    ["a string", "abc"],
    ["a number", 1],
    ["undefined", undefined],
    ["null", null],
  ])("returns false for %s", (_label, payload) => {
    expect(isPlainObject(payload)).toBe(false);
  });

  it("narrows to the given generic type", () => {
    const payload: unknown = { a: 1 };
    if (isPlainObject<{ a: number }>(payload)) {
      expectTypeOf(payload).toEqualTypeOf<{ a: number }>();
      expect(payload.a).toBe(1);
    }
  });
});
