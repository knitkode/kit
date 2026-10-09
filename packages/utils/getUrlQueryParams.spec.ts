import { getUrlQueryParams } from "./getUrlQueryParams";

describe("getUrlQueryParams", () => {
  afterEach(() => {
    history.replaceState(null, "", "/");
  });

  it("parses the query string of an absolute URL", () => {
    expect(getUrlQueryParams("https://example.com/page?a=1&b=two")).toEqual({
      a: "1",
      b: "two",
    });
  });

  it("parses a bare query string", () => {
    expect(getUrlQueryParams("?single=yes")).toEqual({ single: "yes" });
  });

  it("decodes the values", () => {
    expect(getUrlQueryParams("?q=hello%20world&e=%C3%A8")).toEqual({
      q: "hello world",
      e: "è",
    });
  });

  it("keeps empty values", () => {
    expect(getUrlQueryParams("?a=&b=1")).toEqual({ a: "", b: "1" });
  });

  it("returns an empty object when there is no query string", () => {
    expect(getUrlQueryParams("https://example.com/page")).toEqual({});
    expect(getUrlQueryParams("https://example.com/page?")).toEqual({});
  });

  it("returns an empty object for malformed query strings", () => {
    expect(getUrlQueryParams("?flag")).toEqual({});
    expect(getUrlQueryParams('?a="quoted"')).toEqual({});
  });

  it("falls back to the current location search", () => {
    history.replaceState(null, "", "/page?from=location&n=2");
    expect(getUrlQueryParams()).toEqual({ from: "location", n: "2" });
  });

  it("returns an empty object when the current location has no search", () => {
    expect(getUrlQueryParams()).toEqual({});
  });
  describe("outside the browser", () => {
    beforeEach(() => {
      history.replaceState(null, "", "/?from=location");
      vi.resetModules();
      vi.stubGlobal("window", undefined);
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it("does not read the location", async () => {
      const mod = await import("./getUrlQueryParams");
      expect(mod.getUrlQueryParams()).toEqual({});
      expect(mod.getUrlQueryParams("?given=1")).toEqual({ given: "1" });
    });
  });
});
