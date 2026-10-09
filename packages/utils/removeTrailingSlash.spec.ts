import { removeTrailingSlash } from "./removeTrailingSlash";

describe("removeTrailingSlash", () => {
  it.each([
    ["https://example.com/", "https://example.com"],
    ["/path///", "/path"],
    ["/path", "/path"],
    ["/", ""],
    ["/a/b/", "/a/b"],
    ["", ""],
  ])("turns %j into %j", (input, expected) => {
    expect(removeTrailingSlash(input)).toBe(expected);
  });

  it("returns an empty string for nullish input", () => {
    expect(removeTrailingSlash(null)).toBe("");
    expect(removeTrailingSlash(undefined)).toBe("");
    expect(removeTrailingSlash()).toBe("");
  });
});
