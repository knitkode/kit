import { convertRange } from "./convertRange";

describe("convertRange", () => {
  it("converts the documented example", () => {
    expect(convertRange(5, [0, 10], [50, 100])).toBe(75);
  });

  it.each([
    [0, [0, 10], [50, 100], 50],
    [10, [0, 10], [50, 100], 100],
    [0.5, [0, 1], [0, 255], 127.5],
    [50, [0, 100], [-1, 1], 0],
    [-5, [-10, 0], [0, 100], 50],
    [2.5, [0, 10], [100, 0], 75],
    [3, [3, 3.5], [0, 1], 0],
  ])("convertRange(%d, %j, %j) -> %d", (num, r1, r2, expected) => {
    expect(convertRange(num, r1, r2)).toBeCloseTo(expected);
  });

  it("extrapolates numbers outside of the source range", () => {
    expect(convertRange(20, [0, 10], [50, 100])).toBe(150);
    expect(convertRange(-10, [0, 10], [50, 100])).toBe(0);
  });
});
