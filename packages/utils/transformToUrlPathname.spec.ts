import { transformToUrlPathname } from "./transformToUrlPathname";

describe("transformToUrlPathname", () => {
  it.each([
    ["about", "/about"],
    ["Hello World", "/hello-world"],
    ["multi\tspace\nchars", "/multi-space-chars"],
    ["a/b", "/a%2Fb"],
    ["Città", "/citt%C3%A0"],
    ["", "/"],
  ])("transforms %j into %j", (input, expected) => {
    expect(transformToUrlPathname(input)).toBe(expected);
  });

  it("returns an empty string for non string input", () => {
    expect(transformToUrlPathname()).toBe("");
    expect(transformToUrlPathname(undefined)).toBe("");
    // @ts-expect-error testing a non string input at runtime
    expect(transformToUrlPathname(123)).toBe("");
  });
});
