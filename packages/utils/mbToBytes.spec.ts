import { mbToBytes } from "./mbToBytes";

describe("mbToBytes", () => {
  it.each([
    [0, 0],
    [1, 1_000_000],
    [5, 5_000_000],
    [2.5, 2_500_000],
    [0.001, 1000],
  ])("mbToBytes(%d) -> %d", (input, expected) => {
    expect(mbToBytes(input)).toBeCloseTo(expected);
  });
});
