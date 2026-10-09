import { getUrlPathnameParts } from "./getUrlPathnameParts";

describe("getUrlPathnameParts", () => {
  afterEach(() => {
    history.replaceState(null, "", "/");
  });

  it.each([
    ["/en/blog/my-post", ["en", "blog", "my-post"]],
    ["en/blog", ["en", "blog"]],
    ["/en/blog/", ["en", "blog"]],
    ["//en//blog", ["en", "blog"]],
    ["/", []],
  ])("splits %j", (pathname, expected) => {
    expect(getUrlPathnameParts(pathname)).toEqual(expected);
  });

  it("falls back to the current location pathname", () => {
    history.replaceState(null, "", "/it/shop/item?x=1");
    expect(getUrlPathnameParts()).toEqual(["it", "shop", "item"]);
  });

  it("returns an empty array on the root location", () => {
    expect(getUrlPathnameParts()).toEqual([]);
  });
  describe("outside the browser", () => {
    beforeEach(() => {
      history.replaceState(null, "", "/from/location");
      vi.resetModules();
      vi.stubGlobal("window", undefined);
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it("does not read the location", async () => {
      const mod = await import("./getUrlPathnameParts");
      expect(mod.getUrlPathnameParts()).toEqual([]);
      expect(mod.getUrlPathnameParts("/given/path")).toEqual(["given", "path"]);
    });
  });
});
