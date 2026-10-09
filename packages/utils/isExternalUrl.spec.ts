import { isExternalUrl } from "./isExternalUrl";

describe("isExternalUrl", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.doUnmock("./isBrowser");
    vi.resetModules();
  });

  it.each([
    ["an empty string", ""],
    ["a root relative path", "/about"],
    ["a relative path", "about/us"],
    ["a hash link", "#section"],
    ["a query string", "?page=2"],
    ["a mailto link", "mailto:info@example.com"],
    ["a tel link", "tel:+390000000"],
  ])("returns false for %s", (_label, url) => {
    expect(isExternalUrl(url)).toBe(false);
  });

  describe("in the browser, compared to location.href", () => {
    beforeEach(() => {
      vi.stubGlobal("location", { href: "https://example.com/current/page" });
    });

    it.each([
      ["the same host", "https://example.com"],
      ["the same host with a path", "https://example.com/other/page?a=1#b"],
      ["the same host over http", "http://example.com/"],
      ["the same host with a port", "https://example.com:8080/page"],
    ])("returns false for %s", (_label, url) => {
      expect(isExternalUrl(url)).toBe(false);
    });

    it.each([
      ["another domain", "https://other.com"],
      ["another top level domain", "http://example.org/page"],
      ["a subdomain", "https://blog.example.com/post"],
      ["a host with dashes", "https://my-site.co.uk"],
    ])("returns true for %s", (_label, url) => {
      expect(isExternalUrl(url)).toBe(true);
    });
  });

  it("treats every http(s) url as external outside the browser", async () => {
    vi.doMock("./isBrowser", () => ({ isBrowser: false, default: false }));
    vi.resetModules();
    const fresh = await import("./isExternalUrl");
    expect(fresh.isExternalUrl("https://example.com")).toBe(true);
    expect(fresh.isExternalUrl("/about")).toBe(false);
  });

  describe("compared to the given current URL", () => {
    it.each([
      ["https://example.com/a", "https://example.com/b", false],
      ["https://other.com", "https://example.com/b", true],
      ["https://EXAMPLE.com/a", "https://example.COM/b", false],
      ["http://localhost:3000/a", "http://localhost:5173/", false],
      ["http://localhost/a", "https://example.com", true],
    ])("isExternalUrl(%j, %j) -> %j", (url, currentUrl, expected) => {
      vi.stubGlobal("location", { href: "https://unrelated.org" });
      expect(isExternalUrl(url, currentUrl)).toBe(expected);
    });

    it("works without a location global, like in Node.js", () => {
      vi.stubGlobal("location", undefined);
      expect(
        isExternalUrl("https://example.com/a", "https://example.com/b"),
      ).toBe(false);
    });
  });

  it("only considers URLs that start with a protocol", () => {
    vi.stubGlobal("location", { href: "https://example.com/" });
    expect(isExternalUrl("/redirect?to=https://other.com")).toBe(false);
  });
});
