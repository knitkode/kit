import { isDate } from "./isDate";

describe("isDate", () => {
  it.each([
    ["the current date", new Date()],
    ["the epoch", new Date(0)],
    ["a date from an ISO string", new Date("2024-02-29T12:00:00Z")],
    ["a negative timestamp date", new Date(-1)],
  ])("returns true for %s", (_label, payload) => {
    expect(isDate(payload)).toBe(true);
  });

  it.each([
    ["an invalid date", new Date("not a date")],
    ["a timestamp number", Date.now()],
    ["an ISO date string", "2024-01-01"],
    ["undefined", undefined],
    ["null", null],
    ["a plain object", {}],
    ["an array", []],
  ])("returns false for %s", (_label, payload) => {
    expect(isDate(payload)).toBe(false);
  });
});
