import { chunkBySize } from "./chunkBySize";

describe("chunkBySize", () => {
  it.each([
    [
      [1, 2, 3, 4],
      2,
      [
        [1, 2],
        [3, 4],
      ],
    ],
    [[1, 2, 3, 4, 5], 2, [[1, 2], [3, 4], [5]]],
    [[1, 2, 3], 1, [[1], [2], [3]]],
    [[1, 2, 3], 3, [[1, 2, 3]]],
    [[1, 2, 3], 10, [[1, 2, 3]]],
    [[], 2, []],
  ])("chunks %j by %d", (arr, size, expected) => {
    expect(chunkBySize(arr, size)).toEqual(expected);
  });

  it.each([0, -1, 0.5, Number.NaN])(
    "returns the whole array as a single chunk for a size of %d",
    (size) => {
      expect(chunkBySize([1, 2, 3], size)).toEqual([[1, 2, 3]]);
    },
  );

  it("does not mutate the given array", () => {
    const arr = ["a", "b", "c"];
    chunkBySize(arr, 2);
    expect(arr).toEqual(["a", "b", "c"]);
  });
});
