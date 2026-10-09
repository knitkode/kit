import { capitalize } from "./capitalize";

describe("capitalize", () => {
  it.each([
    ["hello", "Hello"],
    ["hello world", "Hello world"],
    ["Hello", "Hello"],
    ["hELLO", "HELLO"],
    ["a", "A"],
    ["élan", "Élan"],
    ["ñu", "Ñu"],
    ["1st place", "1st place"],
    [" leading space", " leading space"],
    ["", ""],
  ])("capitalize(%j) -> %j", (input, expected) => {
    expect(capitalize(input)).toBe(expected);
  });

  it("returns an empty string for null and undefined", () => {
    expect(capitalize(null)).toBe("");
    expect(capitalize(undefined)).toBe("");
    expect(capitalize()).toBe("");
  });

  it("narrows the return type to the capitalized literal", () => {
    expectTypeOf(capitalize("hello")).toEqualTypeOf<"Hello">();
  });
});
