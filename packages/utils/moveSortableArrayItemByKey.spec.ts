import { moveSortableArrayItemByKey } from "./moveSortableArrayItemByKey";

describe("moveSortableArrayItemByKey", () => {
  it("should move an item from the beginning to the end of the array", () => {
    const items = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const result = moveSortableArrayItemByKey(
      items,
      "id",
      { id: 1 },
      { id: 3 },
    );
    expect(result).toEqual([{ id: 2 }, { id: 3 }, { id: 1 }]);
  });

  it("should move an item from the end to the beginning of the array", () => {
    const items = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const result = moveSortableArrayItemByKey(
      items,
      "id",
      { id: 3 },
      { id: 1 },
    );
    expect(result).toEqual([{ id: 3 }, { id: 1 }, { id: 2 }]);
  });

  it("should move an item from the middle of the array", () => {
    const items = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
    const result = moveSortableArrayItemByKey(
      items,
      "id",
      { id: 2 },
      { id: 3 },
    );
    expect(result).toEqual([{ id: 1 }, { id: 3 }, { id: 2 }, { id: 4 }]);
  });

  it("should move an item to the same position", () => {
    const items = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const result = moveSortableArrayItemByKey(
      items,
      "id",
      { id: 2 },
      { id: 2 },
    );
    expect(result).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
  });

  it("should handle moving an item when fromItem is the last item", () => {
    const items = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const result = moveSortableArrayItemByKey(
      items,
      "id",
      { id: 3 },
      { id: 1 },
    );
    expect(result).toEqual([{ id: 3 }, { id: 1 }, { id: 2 }]);
  });

  it("should return a new array without modifying the original", () => {
    const items = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const result = moveSortableArrayItemByKey(
      items,
      "id",
      { id: 1 },
      { id: 3 },
    );
    expect(result).toEqual([{ id: 2 }, { id: 3 }, { id: 1 }]);
    expect(items).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]); // Original should remain unchanged
  });

  it("should not change the given array if fromItem or toItem are not found", () => {
    const items = [{ id: 1 }, { id: 2 }, { id: 3 }];
    expect(
      moveSortableArrayItemByKey(items, "id", { id: 4 }, { id: 5 }),
    ).toEqual(items);
    expect(
      moveSortableArrayItemByKey(items, "id", { id: 5 }, { id: 4 }),
    ).toEqual(items);
  });

  it("should handle empty array", () => {
    const items: any[] = [];
    const result = moveSortableArrayItemByKey(
      items,
      "id",
      { id: 1 },
      { id: 2 },
    );
    expect(result).toEqual([]);
  });

  it("should handle single item array", () => {
    const items = [{ id: 1 }];
    const result = moveSortableArrayItemByKey(
      items,
      "id",
      { id: 1 },
      { id: 1 },
    );
    expect(result).toEqual([{ id: 1 }]);
  });
});
