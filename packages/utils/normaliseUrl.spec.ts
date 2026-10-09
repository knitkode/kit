import { normaliseUrl } from "./normaliseUrl";

describe("normaliseUrl", () => {
  it.each([
    ["https://example.com//a///b", "https://example.com/a/b"],
    ["http://example.com/a/", "http://example.com/a"],
    ["https://example.com///", "https://example.com"],
    ["https://example.com/a?b=1", "https://example.com/a?b=1"],
    ["/relative//path/", "/relative/path"],
    ["//double", "/double"],
    ["", ""],
  ])("normalises %j to %j", (url, expected) => {
    expect(normaliseUrl(url)).toBe(expected);
  });

  it("returns an empty string when called without arguments", () => {
    expect(normaliseUrl()).toBe("");
  });
});
