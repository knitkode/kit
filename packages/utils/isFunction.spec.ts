import { isFunction } from "./isFunction";

function declared() {
  return 1;
}

function* generator() {
  yield 1;
}

describe("isFunction", () => {
  it.each([
    ["a function declaration", declared],
    ["a function expression", function () {}],
    ["an arrow function", () => {}],
    ["an async arrow function", async () => {}],
    ["a generator function", generator],
    ["a bound function", declared.bind(null)],
    ["a built-in function", Math.max],
  ])("returns true for %s", (_label, payload) => {
    expect(isFunction(payload)).toBe(true);
  });

  it.each([
    ["undefined", undefined],
    ["null", null],
    ["the string 'function'", "function"],
    ["a plain object", { call: () => {} }],
    ["an array", []],
    ["a RegExp", /a/],
    ["a Promise", Promise.resolve()],
  ])("returns false for %s", (_label, payload) => {
    expect(isFunction(payload)).toBe(false);
  });
});
