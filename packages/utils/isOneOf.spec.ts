import { isArray } from "./isArray";
import { isBoolean } from "./isBoolean";
import { isNull } from "./isNull";
import { isNumber } from "./isNumber";
import { isOneOf } from "./isOneOf";
import { isString } from "./isString";
import { isUndefined } from "./isUndefined";

describe("isOneOf", () => {
  describe("with two guards", () => {
    const isStringOrNumber = isOneOf(isString, isNumber);

    it.each([
      ["a string", "a"],
      ["a number", 1],
    ])("returns true for %s", (_label, payload) => {
      expect(isStringOrNumber(payload)).toBe(true);
    });

    it.each([
      ["null", null],
      ["a boolean", true],
      ["an array", ["a"]],
    ])("returns false for %s", (_label, payload) => {
      expect(isStringOrNumber(payload)).toBe(false);
    });
  });

  describe("with three guards", () => {
    const guard = isOneOf(isNull, isUndefined, isString);

    it("matches any of the three guards", () => {
      expect(guard(null)).toBe(true);
      expect(guard(undefined)).toBe(true);
      expect(guard("")).toBe(true);
      expect(guard(0)).toBe(false);
    });
  });

  describe("with four guards", () => {
    const guard = isOneOf(isNull, isUndefined, isString, isNumber);

    it("matches any of the four guards", () => {
      expect(guard(42)).toBe(true);
      expect(guard("a")).toBe(true);
      expect(guard(false)).toBe(false);
      expect(guard({})).toBe(false);
    });
  });

  describe("with five guards", () => {
    const guard = isOneOf(isNull, isUndefined, isString, isNumber, isBoolean);

    it("matches any of the five guards", () => {
      expect(guard(false)).toBe(true);
      expect(guard(null)).toBe(true);
      expect(guard([])).toBe(false);
      expect(guard({})).toBe(false);
    });

    it("stops evaluating guards after the first match", () => {
      const calls: string[] = [];
      const first = (payload: unknown): payload is string => {
        calls.push("first");
        return true;
      };
      const second = (payload: unknown): payload is number => {
        calls.push("second");
        return true;
      };
      const third = (payload: unknown): payload is boolean => {
        calls.push("third");
        return true;
      };
      expect(isOneOf(first, second, third)("x")).toBe(true);
      expect(calls).toEqual(["first"]);
    });
  });

  it("narrows the type to the union of the guarded types", () => {
    const payload: unknown = ["a"];
    const guard = isOneOf(isString, isArray);
    if (guard(payload)) {
      expectTypeOf(payload).toEqualTypeOf<string | any[]>();
    }
    expect(guard(payload)).toBe(true);
  });
});
