import { buildUrlQueryString } from "./buildUrlQueryString";

describe("buildUrlQueryString", () => {
  it("should return an empty string for undefined params", () => {
    const result = buildUrlQueryString(undefined);
    expect(result).toBe("");
  });

  it("should return an empty string for null params", () => {
    const result = buildUrlQueryString(null);
    expect(result).toBe("");
  });

  it("should return an empty string for an empty object", () => {
    const result = buildUrlQueryString({});
    expect(result).toBe("");
  });

  it("should encode and format single key-value pair", () => {
    const result = buildUrlQueryString({ key: "value" });
    expect(result).toBe("?key=value");
  });

  it("should encode and format multiple key-value pairs", () => {
    const result = buildUrlQueryString({ key1: "value1", key2: "value2" });
    expect(result).toBe("?key1=value1&key2=value2");
  });

  it("should handle arrays as values", () => {
    const result = buildUrlQueryString({ key: ["value1", "value2"] });
    expect(result).toBe("?key=value1&key=value2");
  });

  it("should ignore null values", () => {
    const result = buildUrlQueryString({ key1: "value1", key2: null });
    expect(result).toBe("?key1=value1");
  });

  it("should ignore undefined values", () => {
    const result = buildUrlQueryString({ key1: "value1", key2: undefined });
    expect(result).toBe("?key1=value1");
  });

  it("should handle mixed values including null and undefined", () => {
    const result = buildUrlQueryString({
      key1: "value1",
      key2: null,
      key3: undefined,
      key4: "value4",
    });
    expect(result).toBe("?key1=value1&key4=value4");
  });

  it("should encode special characters", () => {
    const result = buildUrlQueryString({
      key: "value with spaces & symbols #$%",
    });
    expect(result).toBe(
      "?key=value%20with%20spaces%20%26%20symbols%20%23%24%25",
    );
  });

  it("should handle empty arrays", () => {
    const result = buildUrlQueryString({ key: [] });
    expect(result).toBe("");
  });

  // TODO: test
  // it("should handle complex objects correctly", () => {
  //   const result = buildUrlQueryString({
  //     key1: { nestedKey: "value" },
  //     key2: "value2",
  //   });
  //   expect(result).toBe("?key2=value2"); // Should ignore objects
  // });
  it("should stringify numbers and booleans", () => {
    expect(buildUrlQueryString({ page: 2, draft: true })).toBe(
      "?page=2&draft=true",
    );
  });

  it("should keep falsy but defined values", () => {
    expect(buildUrlQueryString({ a: 0, b: false, c: "" })).toBe(
      "?a=0&b=false&c=",
    );
  });

  it("should encode each array value", () => {
    expect(buildUrlQueryString({ tags: ["a b", "c&d", 3] })).toBe(
      "?tags=a%20b&tags=c%26d&tags=3",
    );
  });

  it("should combine array and scalar values in key order", () => {
    expect(buildUrlQueryString({ a: "1", b: ["2", "3"], c: "4" })).toBe(
      "?a=1&b=2&b=3&c=4",
    );
  });
});
