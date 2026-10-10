import { objectFlat } from "./objectFlat";

describe("objectFlat", () => {
  it("returns a shallow copy of an already flat object", () => {
    const input = { a: 1, b: "b", c: true };
    const result = objectFlat(input);
    expect(result).toEqual(input);
    expect(result).not.toBe(input);
  });

  it("joins nested keys with a dot by default", () => {
    expect(objectFlat({ a: { b: 1, c: { d: 2 } }, e: 3 })).toEqual({
      "a.b": 1,
      "a.c.d": 2,
      e: 3,
    });
  });

  it("joins nested keys with the given delimiter", () => {
    expect(objectFlat({ a: { b: { c: "deep" } } }, "_")).toEqual({
      a_b_c: "deep",
    });
  });

  it("prefixes the keys with the given parent", () => {
    expect(objectFlat({ a: { b: 1 } }, "/", "root")).toEqual({
      "root/a/b": 1,
    });
  });

  it("flattens arrays by index", () => {
    expect(objectFlat({ list: ["x", { y: 1 }] })).toEqual({
      "list.0": "x",
      "list.1.y": 1,
    });
  });

  it("drops empty nested objects", () => {
    expect(objectFlat({ a: {}, b: 1 })).toEqual({ b: 1 });
  });

  it("keeps null values instead of recursing into them", () => {
    expect(objectFlat({ a: null })).toEqual({ a: null });
    expect(objectFlat({ a: { b: null, c: 1 } })).toEqual({
      "a.b": null,
      "a.c": 1,
    });
  });

  it("returns an empty object for an empty input", () => {
    expect(objectFlat({})).toEqual({});
  });
});
