import type { AnyClass } from "./getType";
import { isType } from "./isType";

class Foo {}
class Bar extends Foo {}

describe("isType", () => {
  const truthy: [string, unknown, AnyClass][] = [
    ["a number and Number", 1, Number],
    ["NaN and Number", Number.NaN, Number],
    ["a string and String", "a", String],
    ["a boolean and Boolean", false, Boolean],
    ["an array and Array", [], Array],
    ["a plain object and Object", {}, Object],
    ["a Date and Date", new Date(), Date],
    ["a Map and Map", new Map(), Map],
    ["a class instance and its class", new Foo(), Foo],
    ["a subclass instance and the subclass", new Bar(), Bar],
  ];

  it.each(truthy)("returns true for %s", (_label, payload, type) => {
    expect(isType(payload, type)).toBe(true);
  });

  const falsy: [string, unknown, AnyClass][] = [
    ["a number and String", 1, String],
    ["a numeric string and Number", "1", Number],
    ["null and Object", null, Object],
    ["undefined and Object", undefined, Object],
    ["an array and Object", [], Object],
    ["a plain object and a class", {}, Foo],
    ["a Set and Map", new Set(), Map],
  ];

  it.each(falsy)("returns false for %s", (_label, payload, type) => {
    expect(isType(payload, type)).toBe(false);
  });

  it("throws a TypeError when the type is not a function", () => {
    // @ts-expect-error testing an invalid type argument
    expect(() => isType(1, "Number")).toThrow(
      new TypeError("Type must be a function"),
    );
  });

  it("throws a TypeError when the type is a function without prototype", () => {
    expect(() => isType(1, () => 1)).toThrow(
      new TypeError("Type is not a class"),
    );
  });
});
