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

  it("compares the values strictly, without converting them to strings", () => {
    const input = [{ id: 1 }, { id: "1" }, { id: 1 }];
    expect(removeDuplicatesByKey(input, "id")).toEqual([
      { id: 1 },
      { id: "1" },
    ]);
  });

  it("compares object values by reference", () => {
    const ref = {};
    const input = [{ v: ref }, { v: {} }, { v: ref }];
    expect(removeDuplicatesByKey(input, "v")).toEqual([input[0], input[1]]);
  });

  it("keeps the items whose value is an Object prototype property name", () => {
    const input = [
      { n: "toString" },
      { n: "constructor" },
      { n: "__proto__" },
      { n: "x" },
      { n: "toString" },
    ];
    expect(removeDuplicatesByKey(input, "n")).toEqual(input.slice(0, 4));
  });

  it("does not mutate the given array", () => {
    const input = [{ id: 1 }, { id: 1 }];
    removeDuplicatesByKey(input, "id");
    expect(input).toHaveLength(2);
  });
});
