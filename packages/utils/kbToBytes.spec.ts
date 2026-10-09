import { kbToBytes } from "./kbToBytes";

describe("kbToBytes", () => {
  it.each([
    [0, 0],
    [1, 1000],
    [64, 64_000],
    [1.5, 1500],
    [0.5, 500],
  ])("kbToBytes(%d) -> %d", (input, expected) => {
    expect(kbToBytes(input)).toBe(expected);
  });
});
