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
});
