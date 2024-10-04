import { arrayToLookup } from "./arrayToLookup";

describe("arrayToLookup", () => {
  it("should convert an array of strings to a lookup object", () => {
    const input = ["apple", "banana", "orange"];
    const result = arrayToLookup(input);
    expect(result).toEqual({
      apple: 1,
      banana: 1,
      orange: 1,
    });
  });

  it("should convert an array of numbers to a lookup object", () => {
    const input = [1, 2, 3, 4];
    const result = arrayToLookup(input);
    expect(result).toEqual({
      1: 1,
      2: 1,
      3: 1,
      4: 1,
    });
  });

  it("should convert an array of symbols to a lookup object", () => {
    const sym1 = Symbol("a");
    const sym2 = Symbol("b");
    const input = [sym1, sym2];
    const result = arrayToLookup(input);
    expect(result).toEqual({
      [sym1]: 1,
      [sym2]: 1,
    });
  });

  it("should handle an empty array", () => {
    const input: any[] = [];
    const result = arrayToLookup(input);
    expect(result).toEqual({});
  });

  it("should handle an array with duplicate items", () => {
    const input = ["apple", "banana", "apple"];
    const result = arrayToLookup(input);
    expect(result).toEqual({
      apple: 1,
      banana: 1,
    });
  });

  it("should handle an array with mixed types", () => {
    const input = ["apple", 1, "banana", 2];
    const result = arrayToLookup(input);
    expect(result).toEqual({
      apple: 1,
      1: 1,
      banana: 1,
      2: 1,
    });
  });

  it("should handle an array with symbols and strings", () => {
    const sym1 = Symbol("a");
    const input = ["apple", sym1];
    const result = arrayToLookup(input);
    expect(result).toEqual({
      apple: 1,
      [sym1]: 1,
    });
  });
});
