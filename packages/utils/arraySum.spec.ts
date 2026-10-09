import { arraySum } from "./arraySum";

describe("arraySum", () => {
  it.each([
    [[], 0],
    [[5], 5],
    [[1, 2, 3], 6],
    [[-1, 1], 0],
    [[-5, -10], -15],
    [[0.5, 0.25], 0.75],
  ])("sums %j to %d", (numbers, expected) => {
    expect(arraySum(numbers)).toBe(expected);
  });
});
