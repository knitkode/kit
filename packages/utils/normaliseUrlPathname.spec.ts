import { normaliseUrlPathname } from "./normaliseUrlPathname";

describe("normaliseUrlPathname", () => {
  it.each([
    ["/a//b///c", "/a/b/c"],
    ["/a/b/", "/a/b"],
    ["//a//", "/a"],
    ["a/b", "a/b"],
    ["/", ""],
    ["", ""],
  ])("normalises %j to %j", (pathname, expected) => {
    expect(normaliseUrlPathname(pathname)).toBe(expected);
  });

  it("returns an empty string when called without arguments", () => {
    expect(normaliseUrlPathname()).toBe("");
  });
});
