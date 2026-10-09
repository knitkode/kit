import { getEmptyArray } from "./getEmptyArray";

describe("getEmptyArray", () => {
  it("creates an array of undefined values with the given length", () => {
    expect(getEmptyArray(3)).toEqual([undefined, undefined, undefined]);
  });

  it("accepts the length as a numeric string", () => {
    expect(getEmptyArray("4")).toHaveLength(4);
    expect(getEmptyArray("2")).toEqual([undefined, undefined]);
  });

  it("returns an empty array for a zero length", () => {
    expect(getEmptyArray(0)).toEqual([]);
    expect(getEmptyArray("0")).toEqual([]);
  });

  it("returns an empty array for a non numeric string", () => {
    expect(getEmptyArray("abc")).toEqual([]);
  });

  it("returns a dense array that can be mapped", () => {
    expect(getEmptyArray(3).map((_, idx) => idx)).toEqual([0, 1, 2]);
  });
});
