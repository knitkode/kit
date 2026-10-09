import { isEmptyObject } from "./isEmptyObject";

class Foo {}

describe("isEmptyObject", () => {
  it.each([
    ["an empty object literal", {}],
    ["an empty Object() call result", new Object()],
  ])("returns true for %s", (_label, payload) => {
    expect(isEmptyObject(payload)).toBe(true);
  });

  it.each([
    ["an object with a property", { a: 1 }],
    ["an object with an undefined property", { a: undefined }],
    ["an empty class instance", new Foo()],
    ["an empty array", []],
    ["an empty Map", new Map()],
    ["an empty string", ""],
    ["zero", 0],
    ["undefined", undefined],
    ["null", null],
  ])("returns false for %s", (_label, payload) => {
    expect(isEmptyObject(payload)).toBe(false);
  });
});
