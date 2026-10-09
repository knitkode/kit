import { objectFlip } from "./objectFlip";

describe("objectFlip", () => {
  it("swaps keys and values", () => {
    expect(objectFlip({ a: "x", b: "y" })).toEqual({ x: "a", y: "b" });
  });

  it("stringifies numeric values as keys", () => {
    expect(objectFlip({ one: 1, two: 2 })).toEqual({ 1: "one", 2: "two" });
  });

  it("applies the key transformer to the new values", () => {
    expect(
      objectFlip({ a: "x", b: "y" }, (key) => key.toUpperCase() as "a" | "b"),
    ).toEqual({ x: "A", y: "B" });
  });

  it("keeps the last key when values are duplicated", () => {
    expect(objectFlip({ a: "x", b: "x" })).toEqual({ x: "b" });
  });

  it("returns an empty object for an empty input", () => {
    expect(objectFlip({})).toEqual({});
  });
});
