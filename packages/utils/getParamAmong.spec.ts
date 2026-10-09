import { getParamAmong } from "./getParamAmong";

describe("getParamAmong", () => {
  const allowed = ["asc", "desc"];

  it("returns the param when it is among the allowed values", () => {
    expect(getParamAmong("asc", allowed)).toBe("asc");
    expect(getParamAmong(["desc", "asc"], allowed)).toBe("desc");
  });

  it("returns null when the param is not allowed", () => {
    expect(getParamAmong("random", allowed)).toBeNull();
    expect(getParamAmong(["random", "asc"], allowed)).toBeNull();
    expect(getParamAmong("ASC", allowed)).toBeNull();
  });

  it("returns null when the param is missing", () => {
    expect(getParamAmong(undefined, allowed)).toBeNull();
  });

  it("returns null when no allowed values are given", () => {
    expect(getParamAmong("asc")).toBeNull();
  });

  it("narrows the type to the allowed values", () => {
    const result = getParamAmong("asc", ["asc", "desc"] as ["asc", "desc"]);
    expectTypeOf(result).toEqualTypeOf<"asc" | "desc" | null>();
  });
});
