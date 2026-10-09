import { removeDuplicatesByKey } from "./removeDuplicatesByKey";

describe("removeDuplicatesByKey", () => {
  it("keeps the first item for each key value", () => {
    const input = [
      { id: 1, name: "first" },
      { id: 2, name: "second" },
      { id: 1, name: "duplicate" },
    ];
    expect(removeDuplicatesByKey(input, "id")).toEqual([
      { id: 1, name: "first" },
      { id: 2, name: "second" },
    ]);
  });

  it("returns all items when keys are unique", () => {
    const input = [{ slug: "a" }, { slug: "b" }, { slug: "c" }];
    expect(removeDuplicatesByKey(input, "slug")).toEqual(input);
  });

  it("returns an empty array for an empty or missing list", () => {
    expect(removeDuplicatesByKey([], "id")).toEqual([]);
    expect(removeDuplicatesByKey(undefined, "id")).toEqual([]);
  });

  it("does not mutate the given array", () => {
    const input = [{ id: 1 }, { id: 1 }];
    removeDuplicatesByKey(input, "id");
    expect(input).toHaveLength(2);
  });
});
