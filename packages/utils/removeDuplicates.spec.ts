import { removeDuplicates } from "./removeDuplicates";

describe("removeDuplicates", () => {
  it.each([
    [
      [1, 2, 2, 3, 1],
      [1, 2, 3],
    ],
    [
      ["a", "b", "a"],
      ["a", "b"],
    ],
    [
      [1, "1", true, 1],
      [1, "1", true],
    ],
    [[NaN, NaN], [NaN]],
    [[], []],
  ])("deduplicates %j", (input, expected) => {
    expect(removeDuplicates(input)).toEqual(expected);
  });

  it("compares objects by reference", () => {
    const item = { id: 1 };
    expect(removeDuplicates([item, item, { id: 1 }])).toEqual([
      item,
      { id: 1 },
    ]);
  });

  it("returns a new array", () => {
    const input = [1, 2];
    expect(removeDuplicates(input)).not.toBe(input);
  });
});
