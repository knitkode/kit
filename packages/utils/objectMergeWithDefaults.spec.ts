import { objectMergeWithDefaults } from "./objectMergeWithDefaults";

describe("objectMergeWithDefaults", () => {
  it("should merge correctly keys existing on both 'defaults' and 'overrides'", () => {
    const res = objectMergeWithDefaults(
      { a: "a", b: { c: "c", d: "d" } } as const,
      { b: { e: "e" } } as const,
    );
    expect(res).toEqual({
      a: "a",
      b: { c: "c", d: "d", e: "e" },
    } satisfies typeof res);
  });

  it("should add keys only present in 'overrides'", () => {
    const res = objectMergeWithDefaults(
      { a: "a", b: { c: "c", d: "d" } } as const,
      { b: { e: "e" }, c: { f: "f" } } as const,
    );
    expect(res).toEqual({
      a: "a",
      b: { c: "c", d: "d", e: "e" },
      c: { f: "f" },
    } satisfies typeof res);
  });

  it("should ignore 'null' and 'undefined' values in 'overrides''", () => {
    const res = objectMergeWithDefaults(
      { a: "a", b: { c: "c", d: "d" } } as const,
      { b: null, c: { d: undefined, f: "f" } } as const,
    );
    expect(res).toEqual({
      a: "a",
      b: { c: "c", d: "d" },
      c: { f: "f" },
    } satisfies typeof res);
  });

  it("should remove default values when 'overrides' wants it", () => {
    const res = objectMergeWithDefaults(
      { a: "a", b: "b" } as const,
      { b: null } as const,
      true,
    );
    expect(res).toEqual({ a: "a" } satisfies typeof res);
  });

  it("should handle the presence of arrays without merging but only overriding them", () => {
    const res = objectMergeWithDefaults(
      { c: ["ca", "cb"] } as const,
      { c: ["ca2"] } as const,
    );
    expect(res).toEqual({ c: ["ca2"] } satisfies typeof res);
  });

  it("should override values even if the type is different", () => {
    const res = objectMergeWithDefaults(
      { a: "a", b: 1, c: true, d: ["ca"], e: {} } as const,
      { a: 1, b: "b", c: ["c"], d: true } as const,
    );
    expect(res).toEqual({
      a: 1,
      b: "b",
      c: ["c"],
      d: true,
      e: {},
    } satisfies typeof res);
  });

  it("returns the defaults as they are when no overrides are given", () => {
    const defaults = { a: "a", b: { c: "c" } };
    expect(objectMergeWithDefaults(defaults)).toBe(defaults);
    expect(objectMergeWithDefaults(defaults, undefined)).toBe(defaults);
  });

  it("does not mutate the defaults when overriding existing keys", () => {
    const defaults = { a: "a", b: { c: "c", d: "d" } };
    const res = objectMergeWithDefaults(defaults, { a: "a1", b: { c: "c1" } });
    expect(res).toEqual({ a: "a1", b: { c: "c1", d: "d" } });
    expect(defaults).toEqual({ a: "a", b: { c: "c", d: "d" } });
  });

  it("merges deeply nested objects", () => {
    const res = objectMergeWithDefaults(
      { a: { b: { c: "c", d: "d" } } },
      { a: { b: { d: "d1", e: "e" } } },
    );
    expect(res).toEqual({ a: { b: { c: "c", d: "d1", e: "e" } } });
  });

  it("keeps 'null' overrides from deleting keys unless 'deleteIfNull' is set", () => {
    expect(
      objectMergeWithDefaults({ a: "a", b: "b" }, { b: null }, false),
    ).toEqual({ a: "a", b: "b" });
  });

  it("does not delete keys whose override is 'undefined' even with 'deleteIfNull'", () => {
    expect(
      objectMergeWithDefaults({ a: "a", b: "b" }, { b: undefined }, true),
    ).toEqual({ a: "a", b: "b" });
  });

  it("keeps falsy but defined override values", () => {
    expect(
      objectMergeWithDefaults(
        { a: "a", b: 1, c: true },
        { a: "", b: 0, c: false },
      ),
    ).toEqual({ a: "", b: 0, c: false });
  });
});
