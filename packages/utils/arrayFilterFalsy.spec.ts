import { arrayFilterFalsy } from "./arrayFilterFalsy";

test("filters falsy values", () => {
  const truthy = [{}, [], true, "a", 1, -1];
  const falsy = [null, undefined, false, 0, ""];

  expect(arrayFilterFalsy([...truthy, ...falsy])).toEqual(truthy);
});

test("returns an empty array for nullish input", () => {
  expect(arrayFilterFalsy(null)).toEqual([]);
  expect(arrayFilterFalsy(undefined)).toEqual([]);
  expect(arrayFilterFalsy()).toEqual([]);
});

test("returns a new array and keeps the order", () => {
  const input = [3, 0, 2, null, 1];
  const result = arrayFilterFalsy(input);
  expect(result).toEqual([3, 2, 1]);
  expect(result).not.toBe(input);
  expect(input).toEqual([3, 0, 2, null, 1]);
});

test("narrows the returned type", () => {
  const result = arrayFilterFalsy(["a", "", null, undefined] as (
    | string
    | null
    | undefined
  )[]);
  expectTypeOf(result).toEqualTypeOf<(string | null)[]>();
});
