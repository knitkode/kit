import { areEqual } from "./areEqual";

const a = { a: "a", a1: true, a2: false, a3: 2, a4: null, a5: undefined };
const b = ["a", 0, 1, true, false, null, undefined];
const b1 = [...b, b];
const c = { a, b, b1 };
const c1 = { ...c, c, a, b };
const b2 = [...b, b, c, c1];

const cloneDeepJson = <T>(obj: T) => JSON.parse(JSON.stringify(obj)) as T;

test("are equal objects", () => {
  expect(areEqual(a, a)).toEqual(true);
  expect(areEqual(b, b)).toEqual(true);
  expect(areEqual(c, c)).toEqual(true);
  expect(areEqual(c1, c1)).toEqual(true);
  expect(areEqual(a, cloneDeepJson(a))).toEqual(true);
  expect(areEqual(b, cloneDeepJson(b))).toEqual(true);
  expect(areEqual(c1, cloneDeepJson(c1))).toEqual(true);
});

test("are not equal objects", () => {
  const c1x = cloneDeepJson(c1);
  c1x.c.a.a = "aa";

  expect(areEqual(c1, c1x)).toEqual(false);
  expect(areEqual(a, b)).toEqual(false);
});

test("are equal arrays", () => {
  expect(areEqual(b, b)).toEqual(true);
  expect(areEqual(b1, b1)).toEqual(true);
  expect(areEqual(b2, b2)).toEqual(true);
});

test.each([
  ["equal strings", "a", "a"],
  ["equal numbers", 1, 1],
  ["equal booleans", true, true],
  ["null and undefined", null, undefined],
  ["both undefined", undefined, undefined],
  ["empty objects", {}, {}],
  ["empty arrays", [], []],
  [
    "nested objects",
    { a: { b: [1, { c: "c" }] } },
    { a: { b: [1, { c: "c" }] } },
  ],
])("considers %s equal", (_, x, y) => {
  // @ts-expect-error null and undefined are intentionally passed as inputs
  expect(areEqual(x, y)).toBe(true);
});

test.each([
  ["different strings", "a", "b"],
  ["different numbers", 1, 2],
  ["different booleans", true, false],
  ["a value and undefined", "a", undefined],
  ["an object and undefined", { a: 1 }, undefined],
  ["null and an object", null, { a: 1 }],
  ["a number and its string", 1, "1"],
  ["an array and an object", [1], { 0: 1 }],
  ["arrays of different length", [1, 2], [1, 2, 3]],
  ["arrays with different order", [1, 2], [2, 1]],
  ["objects with different values", { a: 1 }, { a: 2 }],
  [
    "deeply different objects",
    { a: { b: [1, { c: "c" }] } },
    { a: { b: [1, { c: "d" }] } },
  ],
])("considers %s not equal", (_, x, y) => {
  // @ts-expect-error null and undefined are intentionally passed as inputs
  expect(areEqual(x, y)).toBe(false);
});

test("ignores null and undefined object values", () => {
  expect(areEqual({ a: 1, b: undefined }, { a: 1 })).toBe(true);
  expect(areEqual({ a: 1 }, { a: 1, b: undefined })).toBe(true);
  expect(areEqual({ a: 1, b: null }, { a: 1 })).toBe(true);
});
