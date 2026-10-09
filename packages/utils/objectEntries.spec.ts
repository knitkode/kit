import { objectEntries } from "./objectEntries";

describe("objectEntries", () => {
  it("returns the entries of an object in insertion order", () => {
    expect(objectEntries({ a: 1, b: "two", c: true })).toEqual([
      ["a", 1],
      ["b", "two"],
      ["c", true],
    ]);
  });

  it("returns an empty array for an empty object", () => {
    expect(objectEntries({})).toEqual([]);
  });

  it("does not flatten nested values", () => {
    const nested = { x: 1 };
    const entries = objectEntries({ nested });
    expect(entries).toEqual([["nested", nested]]);
    expect(entries[0][1]).toBe(nested);
  });

  it("types the entries with the object keys and values", () => {
    const entries = objectEntries({ a: 1, b: "b" } as { a: number; b: string });
    expectTypeOf(entries).toEqualTypeOf<["a" | "b", number | string][]>();
  });
});
