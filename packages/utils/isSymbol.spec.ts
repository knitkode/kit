import { isSymbol } from "./isSymbol";

describe("isSymbol", () => {
  it.each([
    ["an anonymous symbol", Symbol()],
    ["a described symbol", Symbol("desc")],
    ["a registered symbol", Symbol.for("key")],
    ["a well-known symbol", Symbol.iterator],
  ])("returns true for %s", (_label, payload) => {
    expect(isSymbol(payload)).toBe(true);
  });

  it.each([
    ["the string 'symbol'", "symbol"],
    ["a symbol description", Symbol("a").toString()],
    ["undefined", undefined],
    ["null", null],
    ["a plain object", {}],
    ["an array of symbols", [Symbol()]],
  ])("returns false for %s", (_label, payload) => {
    expect(isSymbol(payload)).toBe(false);
  });
});
