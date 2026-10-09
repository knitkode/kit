import { isNull } from "./isNull";

describe("isNull", () => {
  it("returns true for null", () => {
    expect(isNull(null)).toBe(true);
  });

  it.each([
    ["undefined", undefined],
    ["zero", 0],
    ["an empty string", ""],
    ["the string 'null'", "null"],
    ["false", false],
    ["NaN", Number.NaN],
    ["a plain object", {}],
    ["a null-prototype object", Object.create(null)],
    ["an array", []],
  ])("returns false for %s", (_label, payload) => {
    expect(isNull(payload)).toBe(false);
  });
});
