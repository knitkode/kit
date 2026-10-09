import { uppercase } from "./uppercase";

describe("uppercase", () => {
  it.each([
    ["hello", "HELLO"],
    ["Hello World", "HELLO WORLD"],
    ["ALREADY UPPER", "ALREADY UPPER"],
    ["àéîõü", "ÀÉÎÕÜ"],
    ["straße", "STRASSE"],
    ["mixed 123 !?", "MIXED 123 !?"],
    ["", ""],
  ])("uppercase(%j) -> %j", (input, expected) => {
    expect(uppercase(input)).toBe(expected);
  });

  it("returns an empty string for null and undefined", () => {
    expect(uppercase(null)).toBe("");
    expect(uppercase(undefined)).toBe("");
    expect(uppercase()).toBe("");
  });

  it("narrows the return type to the uppercased literal", () => {
    expectTypeOf(uppercase("HeLLo")).toEqualTypeOf<"HELLO">();
  });
});
