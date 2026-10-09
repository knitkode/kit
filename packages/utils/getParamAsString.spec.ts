import { getParamAsString } from "./getParamAsString";

describe("getParamAsString", () => {
  it.each([
    ["value", "value"],
    [["first", "second"], "first"],
    [[], ""],
    ["", ""],
    [undefined, ""],
  ] as const)("returns %j as %j", (raw, expected) => {
    expect(getParamAsString(raw as string | string[] | undefined)).toBe(
      expected,
    );
  });

  it("returns an empty string when called without arguments", () => {
    expect(getParamAsString()).toBe("");
  });
});
