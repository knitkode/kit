import { objectMergeWithDefaults } from "./objectMergeWithDefaults";

test("objectMergeWithDefaults", () => {
  expect(
    objectMergeWithDefaults(
      { a: "a", b: { c: "c", d: "d" } },
      { b: { e: "e" } },
    ),
  ).toEqual({
    a: "a",
    b: { c: "c", d: "d", e: "e" },
  });
});
