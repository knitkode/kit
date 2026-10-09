import { gbToBytes } from "./gbToBytes";

describe("gbToBytes", () => {
  it.each([
    [0, 0],
    [1, 1_000_000_000],
    [2, 2_000_000_000],
    [1.5, 1_500_000_000],
    [0.001, 1_000_000],
  ])("gbToBytes(%d) -> %d", (input, expected) => {
    expect(gbToBytes(input)).toBeCloseTo(expected);
  });
});
