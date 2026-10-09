import { isError } from "./isError";

class CustomError extends Error {}

describe("isError", () => {
  it.each([
    ["an Error", new Error("boom")],
    ["a TypeError", new TypeError("boom")],
    ["a RangeError", new RangeError("boom")],
    ["an Error subclass instance", new CustomError("boom")],
  ])("returns true for %s", (_label, payload) => {
    expect(isError(payload)).toBe(true);
  });

  it.each([
    ["an error-like plain object", { name: "Error", message: "boom" }],
    ["the string 'Error'", "Error"],
    ["the Error constructor", Error],
    ["undefined", undefined],
    ["null", null],
    ["an array", []],
  ])("returns false for %s", (_label, payload) => {
    expect(isError(payload)).toBe(false);
  });
});
