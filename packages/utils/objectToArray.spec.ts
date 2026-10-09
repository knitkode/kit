import { objectToArray } from "./objectToArray";

describe("objectToArray", () => {
  it("maps each key with its index", () => {
    const iterator = vi.fn((key: string, index: number) => `${index}-${key}`);
    const result = objectToArray({ a: 1, b: 2, c: 3 }, iterator);

    expect(result).toEqual(["0-a", "1-b", "2-c"]);
    expect(iterator.mock.calls.map((args) => args.slice(0, 2))).toEqual([
      ["a", 0],
      ["b", 1],
      ["c", 2],
    ]);
  });

  it("can read the values through the keys", () => {
    const obj = { x: 10, y: 20 };
    expect(objectToArray(obj, (key) => obj[key] * 2)).toEqual([20, 40]);
  });

  it("returns an empty array for an empty object", () => {
    expect(objectToArray({}, () => 1)).toEqual([]);
  });
});
