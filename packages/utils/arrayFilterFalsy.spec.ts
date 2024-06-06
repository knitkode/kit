import { arrayFilterFalsy } from "./arrayFilterFalsy";

test("filters falsy values", () => {
  const truthy = [{}, [], true, "a", 1, -1];
  const falsy = [null, undefined, false, 0, ""];

  expect(arrayFilterFalsy([...truthy, ...falsy])).toEqual(truthy);
});
