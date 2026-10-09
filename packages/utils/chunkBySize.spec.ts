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

  it("does not mutate the given array", () => {
    const arr = ["a", "b", "c"];
    chunkBySize(arr, 2);
    expect(arr).toEqual(["a", "b", "c"]);
  });
});
