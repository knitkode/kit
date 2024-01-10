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
