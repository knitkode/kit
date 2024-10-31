import { addOrReplaceAtIdx } from "./addOrReplaceAtIdx";

describe("addOrReplaceAtIdx", () => {
  it("should replace the item at the right index", () => {
    expect(addOrReplaceAtIdx([1, 2, 3], 4, 1)).toEqual([1, 4, 3]);
  });

  it("should return a new array despite items are the same", () => {
    const a = [1, 2, 3];
    const b = addOrReplaceAtIdx(a, 1, 0);
    expect(b === a).toBeFalsy();
    expect(b).toEqual(a);
  });

  it("should add an item to an empty array", () => {
    const result = addOrReplaceAtIdx([], "newItem");
    expect(result).toEqual(["newItem"]);
  });

  it("should add an item to the end of a non-empty array", () => {
    const input = ["item1", "item2"];
    const result = addOrReplaceAtIdx(input, "item3");
    expect(result).toEqual(["item1", "item2", "item3"]);
  });

  it("should replace an item at a valid index", () => {
    const input = ["item1", "item2", "item3"];
    const result = addOrReplaceAtIdx(input, "newItem", 1);
    expect(result).toEqual(["item1", "newItem", "item3"]);
  });

  it("should add an item to the end if the index is out of bounds", () => {
    const input = ["item1", "item2"];
    const result = addOrReplaceAtIdx(input, "newItem", 5);
    expect(result).toEqual(["item1", "item2", "newItem"]);
  });

  it("should replace an item at the first index", () => {
    const input = ["item1", "item2", "item3"];
    const result = addOrReplaceAtIdx(input, "newItem", 0);
    expect(result).toEqual(["newItem", "item2", "item3"]);
  });

  it("should replace an item at the last index", () => {
    const input = ["item1", "item2", "item3"];
    const result = addOrReplaceAtIdx(input, "newItem", 2);
    expect(result).toEqual(["item1", "item2", "newItem"]);
  });

  it("should return the same array if replacing with the same item", () => {
    const input = ["item1", "item2", "item3"];
    const result = addOrReplaceAtIdx(input, "item2", 1);
    expect(result).toEqual(["item1", "item2", "item3"]);
  });

  it("should handle non-string items correctly", () => {
    const input = [1, 2, 3];
    const result = addOrReplaceAtIdx(input, 4, 1);
    expect(result).toEqual([1, 4, 3]);
  });

  it("should handle complex objects correctly", () => {
    const input = [{ id: 1 }, { id: 2 }];
    const newItem = { id: 3 };
    const result = addOrReplaceAtIdx(input, newItem, 1);
    expect(result).toEqual([{ id: 1 }, { id: 3 }]);
  });
});
