import { updateUrlQueryParams } from "./updateUrlQueryParams";

describe("updateUrlQueryParams", () => {
  it("adds params to a URL without query string", () => {
    expect(
      updateUrlQueryParams("https://example.com/p", { a: 1, b: "x" }),
    ).toBe("https://example.com/p?a=1&b=x");
  });

  it("merges params into an existing query string", () => {
    expect(
      updateUrlQueryParams("https://example.com/p?a=1&b=2", { b: 3, c: 4 }),
    ).toBe("https://example.com/p?a=1&b=3&c=4");
  });

  it("removes the params set to null", () => {
    expect(updateUrlQueryParams("/p?a=1&b=2", { a: null })).toBe("/p?b=2");
  });

  it("ignores null params on a URL without query string", () => {
    expect(updateUrlQueryParams("/p", { a: null, b: "1" })).toBe("/p?b=1");
  });

  it("supports array params", () => {
    expect(updateUrlQueryParams("/p?a=1", { tags: ["x", "y"] })).toBe(
      "/p?a=1&tags=x&tags=y",
    );
  });

  it("encodes the values", () => {
    expect(updateUrlQueryParams("/p", { q: "a b&c" })).toBe("/p?q=a%20b%26c");
  });

  it("keeps the encoded keys as they are", () => {
    expect(updateUrlQueryParams("/p?a%20b=1", { c: "2" })).toBe(
      "/p?a%20b=1&c=2",
    );
  });

  it("returns the URL untouched without new params", () => {
    expect(updateUrlQueryParams("/p")).toBe("/p");
    expect(updateUrlQueryParams("/p?a=1")).toBe("/p?a=1");
  });
});
