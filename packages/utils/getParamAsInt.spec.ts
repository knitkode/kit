import { getParamAsInt } from "./getParamAsInt";

describe("getParamAsInt", () => {
  it.each([
    ["12", 12],
    ["-3", -3],
    ["007", 7],
    ["4.9", 4],
    ["10px", 10],
  ])("parses %j as %d", (raw, expected) => {
    expect(getParamAsInt(raw)).toBe(expected);
  });

  it("uses the first value of an array", () => {
    expect(getParamAsInt(["5", "6"])).toBe(5);
  });

  it("returns null by default when the param is missing or empty", () => {
    expect(getParamAsInt()).toBeNull();
    expect(getParamAsInt(undefined)).toBeNull();
    expect(getParamAsInt("")).toBeNull();
    expect(getParamAsInt([])).toBeNull();
  });

  it("returns the given fallback when the param is missing or empty", () => {
    expect(getParamAsInt(undefined, 1)).toBe(1);
    expect(getParamAsInt("", 0)).toBe(0);
    expect(getParamAsInt([], -1)).toBe(-1);
  });

  it("returns the fallback when the param is not a number", () => {
    expect(getParamAsInt("abc")).toBeNull();
    expect(getParamAsInt("abc", 3)).toBe(3);
    expect(getParamAsInt(["x1", "2"], 0)).toBe(0);
  });

  it("ignores the fallback when the param is present", () => {
    expect(getParamAsInt("8", 1)).toBe(8);
  });
});
