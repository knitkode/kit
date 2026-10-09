import { arrayFindLastIndex } from "./arrayFindLastIndex";

test("arrayFindLastIndex", () => {
  expect(arrayFindLastIndex([2], (v) => v === 2)).toEqual(0);
  expect(arrayFindLastIndex([2, 2], (v) => v === 2)).toEqual(1);
  expect(arrayFindLastIndex([1, 2, 3], (v) => v === 2)).toEqual(1);
  expect(arrayFindLastIndex([1, 2, 3, 2], (v) => v === 2)).toEqual(3);
});

test("arrayFindLastIndex returns -1 when nothing matches", () => {
  expect(arrayFindLastIndex([1, 2, 3], (v) => v === 4)).toEqual(-1);
  expect(arrayFindLastIndex([], () => true)).toEqual(-1);
});

test("arrayFindLastIndex iterates from the end and stops at the first match", () => {
  const list = ["a", "b", "c"];
  const predicate = vi.fn((value: string) => value === "b");
  expect(arrayFindLastIndex(list, predicate)).toEqual(1);
  expect(predicate.mock.calls).toEqual([
    ["c", 2, list],
    ["b", 1, list],
  ]);
});
