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

  it.each([
    [{ m: 1, a: 2 }, "m", ["m", "a"]],
    [{ b: 1, z: 2, a: 3 }, "z", ["z", "a", "b"]],
    [{ c: 1, m: 2, b: 3, a: 4 }, "m", ["m", "a", "b", "c"]],
  ] as const)(
    "sorts %j with %j first and then the rest alphabetically",
    (data, keyMatch, expected) => {
      expect(
        Object.keys(
          objectSortByKeysMatching(data, keyMatch as keyof typeof data),
        ),
      ).toEqual(expected);
    },
  );

  it("returns a new object", () => {
    const input = { b: 1, a: 2 };
    expect(objectSortByKeysMatching(input, "a")).not.toBe(input);
    expect(Object.keys(input)).toEqual(["b", "a"]);
  });
});
