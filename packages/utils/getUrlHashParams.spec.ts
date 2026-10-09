import { getUrlHashParams } from "./getUrlHashParams";

describe("getUrlHashParams", () => {
  afterEach(() => {
    history.replaceState(null, "", "/");
  });

  it("parses the params after the '?' of the given hash", () => {
    expect(getUrlHashParams("#/path?a=1&b=two")).toEqual({ a: "1", b: "two" });
  });

  it("decodes the params", () => {
    expect(getUrlHashParams("#/?q=hello%20world&r=a+b")).toEqual({
      q: "hello world",
      r: "a b",
    });
  });

  it("returns an empty object when the hash has no params", () => {
    expect(getUrlHashParams("#/path")).toEqual({});
  });

  it("falls back to the current location hash", () => {
    history.replaceState(null, "", "/page#/section?tab=info");
    expect(getUrlHashParams()).toEqual({ tab: "info" });
  });

  it("returns an empty object when there is no hash at all", () => {
    expect(getUrlHashParams()).toEqual({});
  });
});
