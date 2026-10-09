import { findDuplicatedIndexes } from "./findDuplicatedIndexes";

describe("findDuplicatedIndexes", () => {
  it("flags the indexes of the repeated occurrences", () => {
    expect(findDuplicatedIndexes([1, 2, 1, 3, 2, 1])).toEqual({
      2: true,
      4: true,
      5: true,
    });
  });

  it("returns an empty object when there are no duplicates", () => {
    expect(findDuplicatedIndexes(["a", "b", "c"])).toEqual({});
  });

  it("returns an empty object for an empty array", () => {
    expect(findDuplicatedIndexes([])).toEqual({});
  });

  it("compares strictly", () => {
    expect(findDuplicatedIndexes([1, "1", true, 1])).toEqual({ 3: true });
  });

  it("compares objects by reference", () => {
    const item = { id: 1 };
    expect(findDuplicatedIndexes([item, { id: 1 }, item])).toEqual({ 2: true });
  });
});
