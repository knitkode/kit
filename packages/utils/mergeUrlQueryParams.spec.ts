import { mergeUrlQueryParams } from "./mergeUrlQueryParams";

describe("mergeUrlQueryParams", () => {
  it("adds new params and overrides existing ones", () => {
    expect(mergeUrlQueryParams({ a: "1", b: "2" }, { b: "3", c: "4" })).toEqual(
      { a: "1", b: "3", c: "4" },
    );
  });

  it("deletes existing params whose new value is null", () => {
    expect(mergeUrlQueryParams({ a: "1", b: "2" }, { a: null })).toEqual({
      b: "2",
    });
  });

  it("mutates and returns the first object", () => {
    const oldParams = { a: "1" };
    const result = mergeUrlQueryParams(oldParams, { b: "2" });
    expect(result).toBe(oldParams);
    expect(oldParams).toEqual({ a: "1", b: "2" });
  });

  it("does not mutate the new params", () => {
    const newParams = { a: null, b: "2" };
    mergeUrlQueryParams({ a: "1" }, newParams);
    expect(newParams).toEqual({ a: null, b: "2" });
  });

  it("defaults both arguments to empty objects", () => {
    expect(mergeUrlQueryParams()).toEqual({});
    expect(mergeUrlQueryParams(undefined, { a: "1" })).toEqual({ a: "1" });
    expect(mergeUrlQueryParams({ a: "1" })).toEqual({ a: "1" });
  });
});
