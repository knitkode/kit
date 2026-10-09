import { isPromise } from "./isPromise";

describe("isPromise", () => {
  it.each([
    ["a resolved promise", Promise.resolve(1)],
    ["a pending promise", new Promise(() => {})],
    ["the result of an async function", (async () => 1)()],
  ])("returns true for %s", (_label, payload) => {
    expect(isPromise(payload)).toBe(true);
  });

  it.each([
    ["a thenable object", { then: () => {} }],
    ["an async function (not called)", async () => 1],
    ["the Promise constructor", Promise],
    ["undefined", undefined],
    ["null", null],
    ["a plain object", {}],
  ])("returns false for %s", (_label, payload) => {
    expect(isPromise(payload)).toBe(false);
  });
});
