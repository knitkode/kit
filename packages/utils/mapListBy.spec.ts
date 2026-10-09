import { mapListBy } from "./mapListBy";

describe("mapListBy", () => {
  it("maps the list by the given key", () => {
    const alice = { id: "a", name: "Alice" };
    const bob = { id: "b", name: "Bob" };
    const result = mapListBy([alice, bob], "id");
    expect(result).toEqual({ a: alice, b: bob });
    expect(result["a"]).toBe(alice);
  });

  it("maps by numeric values", () => {
    expect(mapListBy([{ id: 1 }, { id: 2 }], "id")).toEqual({
      1: { id: 1 },
      2: { id: 2 },
    });
  });

  it("keeps the last item when keys are duplicated", () => {
    expect(
      mapListBy(
        [
          { id: 1, v: "first" },
          { id: 1, v: "last" },
        ],
        "id",
      ),
    ).toEqual({ 1: { id: 1, v: "last" } });
  });

  it("returns an empty object for an empty or missing list", () => {
    expect(mapListBy([], "id")).toEqual({});
    expect(mapListBy()).toEqual({});
  });
});
