import { forin } from "./forin";

describe("forin", () => {
  it("calls back with each key and value", () => {
    const cb = vi.fn();
    forin({ a: 1, b: "two" }, cb);
    expect(cb.mock.calls).toEqual([
      ["a", 1],
      ["b", "two"],
    ]);
  });

  it("does not call back for an empty object", () => {
    const cb = vi.fn();
    forin({}, cb);
    expect(cb).not.toHaveBeenCalled();
  });

  it("iterates over inherited enumerable properties like a native for in", () => {
    const parent = { inherited: 1 };
    const child = Object.create(parent) as { own: number; inherited: number };
    child.own = 2;
    const keys: string[] = [];
    forin(child, (key) => keys.push(key));
    expect(keys).toEqual(["own", "inherited"]);
  });
});
