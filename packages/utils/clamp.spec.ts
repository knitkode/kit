import { clamp } from "./clamp";

describe("clamp", () => {
  it.each([
    [5, 0, 10, 5],
    [-5, 0, 10, 0],
    [15, 0, 10, 10],
    [0, 0, 10, 0],
    [10, 0, 10, 10],
    [-15, -10, -5, -10],
    [-1, -10, -5, -5],
    [0.5, 0, 1, 0.5],
    [1.0001, 0, 1, 1],
    [7, 7, 7, 7],
    [Number.POSITIVE_INFINITY, 0, 100, 100],
    [Number.NEGATIVE_INFINITY, 0, 100, 0],
  ])("clamp(%d, %d, %d) -> %d", (num, min, max, expected) => {
    expect(clamp(num, min, max)).toBe(expected);
  });
});
