import { lowercase } from "./lowercase";

describe("lowercase", () => {
  it.each([
    ["HELLO", "hello"],
    ["Hello World", "hello world"],
    ["already lower", "already lower"],
    ["ÀÉÎÕÜ", "àéîõü"],
    ["MIXED 123 !?", "mixed 123 !?"],
    ["", ""],
  ])("lowercase(%j) -> %j", (input, expected) => {
    expect(lowercase(input)).toBe(expected);
  });

  it("returns an empty string for null and undefined", () => {
    expect(lowercase(null)).toBe("");
    expect(lowercase(undefined)).toBe("");
    expect(lowercase()).toBe("");
  });

  it("narrows the return type to the lowercased literal", () => {
    expectTypeOf(lowercase("HeLLo")).toEqualTypeOf<"hello">();
  });
});
