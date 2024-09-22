import { objectMergeWithDefaults } from "./objectMergeWithDefaults";

test("objectMergeWithDefaults", () => {
  const a = objectMergeWithDefaults(
    { a: "a", b: { c: "c", d: "d" } },
    { b: { e: "e" } },
  );
  expect(a).toEqual({
    a: "a",
    b: { c: "c", d: "d", e: "e" },
  });

  const b = objectMergeWithDefaults(
    { a: "a", b: { c: "c", d: "d" } },
    { b: { e: "e" }, c: { f: "f" } },
  );
  expect(b).toEqual({
    a: "a",
    b: { c: "c", d: "d", e: "e" },
    c: { f: "f" },
  });

  const c = objectMergeWithDefaults(
    { a: "a", b: { c: "c", d: "d" } },
    { b: null, c: { f: "f" } },
  );
  expect(c).toEqual({
    a: "a",
    b: { c: "c", d: "d" },
    c: { f: "f" },
  });
});
