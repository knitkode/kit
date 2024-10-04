import { arrayUniqueByProperties } from "./arrayUniqueByProperties";

describe("arrayUniqueByProperties", () => {
  it("should return an array with unique objects based on specified keys", () => {
    const input = [
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
      { id: 1, name: "Alice" },
    ];
    const result = arrayUniqueByProperties(input, ["id", "name"]);
    expect(result).toEqual([
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
    ]);
  });

  it("should return the original array if all objects are unique", () => {
    const input = [
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
      { id: 3, name: "Charlie" },
    ];
    const result = arrayUniqueByProperties(input, ["id", "name"]);
    expect(result).toEqual(input);
  });

  it("should handle an empty array", () => {
    const input: any[] = [];
    const result = arrayUniqueByProperties(input, ["id"]);
    expect(result).toEqual([]);
  });

  it("should handle an array with one object", () => {
    const input = [{ id: 1, name: "Alice" }];
    const result = arrayUniqueByProperties(input, ["id"]);
    expect(result).toEqual(input);
  });

  it("should ignore additional properties when checking for uniqueness", () => {
    const input = [
      { id: 1, name: "Alice", age: 30 },
      { id: 1, name: "Alice", age: 25 },
      { id: 2, name: "Bob", age: 40 },
    ];
    const result = arrayUniqueByProperties(input, ["id", "name"]);
    expect(result).toEqual([
      { id: 1, name: "Alice", age: 30 },
      { id: 2, name: "Bob", age: 40 },
    ]);
  });

  it("should return an empty array for an array of empty objects", () => {
    const input = [{}];
    const result = arrayUniqueByProperties(input, ["id"] as never);
    expect(result).toEqual(input);
  });

  it("should handle primitive values correctly", () => {
    const input = [
      { id: "1", name: "Alice" },
      { id: 1, name: "Alice" },
      { id: "1", name: "Bob" },
    ];
    const result = arrayUniqueByProperties(input, ["id"]);
    expect(result).toEqual([{ id: "1", name: "Alice" }]);
  });

  it("should work with nested properties", () => {
    const input = [
      { id: 1, info: { name: "Alice" } },
      { id: 1, info: { name: "Alice" } },
      { id: 2, info: { name: "Bob" } },
    ];
    const result = arrayUniqueByProperties(input, ["id", "info"]);
    expect(result).toEqual([
      { id: 1, info: { name: "Alice" } },
      { id: 2, info: { name: "Bob" } },
    ]);
  });
});
