import { arrayFindLastIndex } from "./arrayFindLastIndex";

test("arrayFindLastIndex", () => {
  expect(arrayFindLastIndex([2], (v) => v === 2)).toEqual(0);
  expect(arrayFindLastIndex([2, 2], (v) => v === 2)).toEqual(1);
  expect(arrayFindLastIndex([1, 2, 3], (v) => v === 2)).toEqual(1);
  expect(arrayFindLastIndex([1, 2, 3, 2], (v) => v === 2)).toEqual(3);
});
