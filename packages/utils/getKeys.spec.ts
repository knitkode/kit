import { getKeys } from "./getKeys";

describe("getKeys", () => {
  it("returns the own enumerable keys", () => {
    expect(getKeys({ a: 1, b: 2 })).toEqual(["a", "b"]);
  });

  it("returns an empty array for an empty object", () => {
    expect(getKeys({})).toEqual([]);
  });

  it("keeps the keys typed", () => {
    expectTypeOf(getKeys({ a: 1, b: 2 })).toEqualTypeOf<("a" | "b")[]>();
  });
});
