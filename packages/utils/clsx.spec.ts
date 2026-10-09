import { clsx } from "./clsx";

describe("clsx", () => {
  it.each([
    [[], ""],
    [["a"], "a"],
    [["a", "b"], "a b"],
    [[1, 2], "1 2"],
    [["a", 0, "b"], "a b"],
    [["a", null, undefined, false, true, "", "b"], "a b"],
    [[{ a: true, b: false, c: 1, d: 0, e: "yes", f: "" }], "a c e"],
    [[["a", "b"]], "a b"],
    [[["a", ["b", ["c", { d: true }]]]], "a b c d"],
    [[["a", null, false, "", 0, "b"]], "a b"],
    [[[], {}, [[]]], ""],
    [["a", { b: true }, ["c", { d: false }]], "a b c"],
  ])("clsx(...%j) returns %j", (args, expected) => {
    expect(clsx(...args)).toBe(expected);
  });

  it("does not trim or dedupe the given strings", () => {
    expect(clsx("a", "a")).toBe("a a");
    expect(clsx(" a ")).toBe(" a ");
  });
});
