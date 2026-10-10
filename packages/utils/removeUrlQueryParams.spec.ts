import { removeUrlQueryParams } from "./removeUrlQueryParams";

describe("removeUrlQueryParams", () => {
  it("removes the given params", () => {
    expect(
      removeUrlQueryParams("https://example.com/p?a=1&b=2&c=3", ["a", "c"]),
    ).toBe("https://example.com/p?b=2");
  });

  it("drops the '?' when every param is removed", () => {
    expect(removeUrlQueryParams("https://example.com/p?a=1", ["a"])).toBe(
      "https://example.com/p",
    );
  });

  it("keeps the params when none matches", () => {
    expect(removeUrlQueryParams("/p?a=1&b=2", ["x"])).toBe("/p?a=1&b=2");
  });

  it("keeps the params when called without keys", () => {
    expect(removeUrlQueryParams("/p?a=1")).toBe("/p?a=1");
  });

  it("re-encodes the kept values", () => {
    expect(removeUrlQueryParams("/p?q=a%20b&x=1", ["x"])).toBe("/p?q=a%20b");
  });

  it("keeps the encoded keys as they are", () => {
    expect(removeUrlQueryParams("/p?a%20b=1&x=1", ["x"])).toBe("/p?a%20b=1");
  });

  it("returns the URL untouched when it has no query string", () => {
    expect(removeUrlQueryParams("https://example.com/p", ["a"])).toBe(
      "https://example.com/p",
    );
  });
});
