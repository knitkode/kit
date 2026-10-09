import { objectKeys } from "./objectKeys";

describe("objectKeys", () => {
  it("returns the own enumerable keys of an object", () => {
    expect(objectKeys({ a: 1, b: 2, c: { d: 3 } })).toEqual(["a", "b", "c"]);
  });

  it("returns an empty array for an empty object", () => {
    expect(objectKeys({})).toEqual([]);
  });

  it("ignores inherited properties", () => {
    const child = Object.create({ inherited: true }) as Record<string, number>;
    child["own"] = 1;
    expect(objectKeys(child)).toEqual(["own"]);
  });

  it("types the keys as the object keys", () => {
    expectTypeOf(objectKeys({ a: 1, b: 2 })).toEqualTypeOf<("a" | "b")[]>();
  });
});
