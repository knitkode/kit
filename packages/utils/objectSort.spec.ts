import { objectSort } from "./objectSort";

describe("objectSort", () => {
  it("sorts the properties by key when no compare function is given", () => {
    expect(Object.keys(objectSort({ c: 1, a: 2, b: 3 }))).toEqual([
      "a",
      "b",
      "c",
    ]);
  });

  it("keeps the values attached to their keys", () => {
    expect(objectSort({ c: 1, a: 2, b: 3 })).toEqual({ a: 2, b: 3, c: 1 });
  });

  it("sorts with the given compare function", () => {
    const result = objectSort({ a: 3, b: 1, c: 2 }, ([, a], [, b]) => a - b);
    expect(Object.keys(result)).toEqual(["b", "c", "a"]);
  });

  it("returns a new object", () => {
    const input = { b: 1, a: 2 };
    const result = objectSort(input);
    expect(result).not.toBe(input);
    expect(Object.keys(input)).toEqual(["b", "a"]);
  });

  it("returns an empty object for an empty input", () => {
    expect(objectSort({})).toEqual({});
  });
});
