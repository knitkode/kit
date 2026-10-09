import { objectSortByKeysMatching } from "./objectSortByKeysMatching";

describe("objectSortByKeysMatching", () => {
  it("sorts the keys with localeCompare when none matches", () => {
    const result = objectSortByKeysMatching(
      { banana: 1, apple: 2, cherry: 3 },
      "missing" as "apple",
    );
    expect(Object.keys(result)).toEqual(["apple", "banana", "cherry"]);
    expect(result).toEqual({ apple: 2, banana: 1, cherry: 3 });
  });

  it("keeps the matching key first", () => {
    const result = objectSortByKeysMatching({ c: 1, b: 2, a: 3 }, "a");
    expect(Object.keys(result)).toEqual(["a", "b", "c"]);
  });

  it("returns a new object", () => {
    const input = { b: 1, a: 2 };
    expect(objectSortByKeysMatching(input, "a")).not.toBe(input);
    expect(Object.keys(input)).toEqual(["b", "a"]);
  });
});
