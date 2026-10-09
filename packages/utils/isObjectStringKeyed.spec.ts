import * as starImport from "./fixtures";
import { isObjectStringKeyed } from "./isObjectStringKeyed";

class Foo {}

describe("isObjectStringKeyed", () => {
  it.each([
    ["an empty object", {}],
    ["an object with properties", { a: 1, b: "2" }],
    ["an Object() call result", new Object()],
    ["a module namespace", starImport],
  ])("returns true for %s", (_label, payload) => {
    expect(isObjectStringKeyed(payload)).toBe(true);
  });

  it.each([
    ["a class instance", new Foo()],
    ["an object with a custom prototype", Object.create({ a: 1 })],
    ["an array", []],
    ["a Date", new Date()],
    ["a Map", new Map()],
    ["a function", () => ({})],
    ["a string", "abc"],
    ["undefined", undefined],
    ["null", null],
  ])("returns false for %s", (_label, payload) => {
    expect(isObjectStringKeyed(payload)).toBe(false);
  });
});
