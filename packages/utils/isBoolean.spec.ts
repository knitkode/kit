import { isBoolean } from "./isBoolean";

describe("isBoolean", () => {
  it.each([
    ["true", true],
    ["false", false],
    ["a Boolean() call result", Boolean(0)],
  ])("returns true for %s", (_label, payload) => {
    expect(isBoolean(payload)).toBe(true);
  });

  it.each([
    ["zero", 0],
    ["one", 1],
    ["the string 'true'", "true"],
    ["an empty string", ""],
    ["undefined", undefined],
    ["null", null],
    ["an array", [true]],
    ["a plain object", {}],
  ])("returns false for %s", (_label, payload) => {
    expect(isBoolean(payload)).toBe(false);
  });
});
