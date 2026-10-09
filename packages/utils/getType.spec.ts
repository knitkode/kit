import * as starImport from "./fixtures";
import { getType } from "./getType";

class Foo {}

describe("getType", () => {
  it.each([
    { label: "undefined", payload: undefined, expected: "Undefined" },
    { label: "null", payload: null, expected: "Null" },
    { label: "a boolean", payload: true, expected: "Boolean" },
    { label: "a number", payload: 42, expected: "Number" },
    { label: "NaN", payload: Number.NaN, expected: "Number" },
    {
      label: "Infinity",
      payload: Number.POSITIVE_INFINITY,
      expected: "Number",
    },
    { label: "a bigint", payload: 10n, expected: "BigInt" },
    { label: "an empty string", payload: "", expected: "String" },
    { label: "a symbol", payload: Symbol("s"), expected: "Symbol" },
    { label: "an array", payload: [1, 2], expected: "Array" },
    { label: "a plain object", payload: { a: 1 }, expected: "Object" },
    {
      label: "a null-prototype object",
      payload: Object.create(null),
      expected: "Object",
    },
    { label: "a class instance", payload: new Foo(), expected: "Object" },
    { label: "a Date", payload: new Date(), expected: "Date" },
    { label: "a RegExp", payload: /a/g, expected: "RegExp" },
    { label: "a Map", payload: new Map(), expected: "Map" },
    { label: "a Set", payload: new Set(), expected: "Set" },
    { label: "a WeakMap", payload: new WeakMap(), expected: "WeakMap" },
    { label: "a WeakSet", payload: new WeakSet(), expected: "WeakSet" },
    { label: "a Promise", payload: Promise.resolve(), expected: "Promise" },
    { label: "an Error", payload: new Error("x"), expected: "Error" },
    { label: "a TypeError", payload: new TypeError("x"), expected: "Error" },
    { label: "an arrow function", payload: () => 1, expected: "Function" },
    {
      label: "an async function",
      payload: async () => 1,
      expected: "AsyncFunction",
    },
    {
      label: "a typed array",
      payload: new Uint8Array(2),
      expected: "Uint8Array",
    },
    {
      label: "an ArrayBuffer",
      payload: new ArrayBuffer(2),
      expected: "ArrayBuffer",
    },
    { label: "a module namespace", payload: starImport, expected: "Module" },
    {
      label: "an object with a custom Symbol.toStringTag",
      payload: { [Symbol.toStringTag]: "Custom" },
      expected: "Custom",
    },
  ])("returns $expected for $label", ({ payload, expected }) => {
    expect(getType(payload)).toBe(expected);
  });

  it("returns the type of a missing argument as Undefined", () => {
    // @ts-expect-error testing a call without the required argument
    expect(getType()).toBe("Undefined");
  });
});
