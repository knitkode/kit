import { removeIndexesFromArray } from "./removeIndexesFromArray";

describe("removeIndexesFromArray", () => {
  it("removes the given indexes", () => {
    expect(
      removeIndexesFromArray(["a", "b", "c", "d"], { 0: true, 2: true }),
    ).toEqual(["b", "d"]);
  });

  it("returns a copy when no indexes are given", () => {
    const input = [1, 2, 3];
    const result = removeIndexesFromArray(input, {});
    expect(result).toEqual(input);
    expect(result).not.toBe(input);
  });

  it("ignores out of range indexes", () => {
    expect(removeIndexesFromArray([1, 2], { 5: true, [-1]: true })).toEqual([
      1, 2,
    ]);
  });

  it("can remove every item", () => {
    expect(removeIndexesFromArray([1, 2], { 0: true, 1: true })).toEqual([]);
  });
});
