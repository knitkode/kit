import { removeDuplicatesComparing } from "./removeDuplicatesComparing";

describe("removeDuplicatesComparing", () => {
  it("removes from 'to' the indexes duplicated in 'from'", () => {
    expect(
      removeDuplicatesComparing([1, 2, 1, 3, 2], ["a", "b", "c", "d", "e"]),
    ).toEqual(["a", "b", "d"]);
  });

  it("returns a copy of 'to' when 'from' has no duplicates", () => {
    const to = ["a", "b"];
    const result = removeDuplicatesComparing([1, 2], to);
    expect(result).toEqual(["a", "b"]);
    expect(result).not.toBe(to);
  });

  it("handles empty arrays", () => {
    expect(removeDuplicatesComparing([], [])).toEqual([]);
    expect(removeDuplicatesComparing([1, 1], [])).toEqual([]);
  });
});
