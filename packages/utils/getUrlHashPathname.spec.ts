import { getUrlHashPathname } from "./getUrlHashPathname";

describe("getUrlHashPathname", () => {
  afterEach(() => {
    history.replaceState(null, "", "/");
  });

  it.each([
    ["#/products/shoes", "products/shoes"],
    ["#/products?color=red", "products"],
    ["#/", ""],
    ["#foo", "foo"],
    ["#foo/bar?x=1", "foo/bar"],
    ["#//a", "a"],
    ["#///a/b", "a/b"],
    ["/a", "a"],
    ["#", ""],
    ["#?x=1", ""],
  ])("extracts the pathname of %j", (hash, expected) => {
    expect(getUrlHashPathname(hash)).toBe(expected);
  });

  it("falls back to the current location hash", () => {
    history.replaceState(null, "", "/page#/section/sub?tab=info");
    expect(getUrlHashPathname()).toBe("section/sub");
  });

  it("returns an empty string when there is no hash at all", () => {
    expect(getUrlHashPathname()).toBe("");
  });
});
