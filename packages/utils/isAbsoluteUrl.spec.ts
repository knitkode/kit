import { isAbsoluteUrl } from "./isAbsoluteUrl";

describe("isAbsoluteUrl", () => {
  test("valid absolute URLs", () => {
    expect(isAbsoluteUrl("http://example.com")).toBe(true);
    expect(isAbsoluteUrl("https://example.com")).toBe(true);
    expect(isAbsoluteUrl("ftp://example.com")).toBe(true);
    expect(isAbsoluteUrl("mailto:example@example.com")).toBe(true);
    expect(isAbsoluteUrl("file:///path/to/file")).toBe(true);
    expect(isAbsoluteUrl("http://example.com:8080/path")).toBe(true);
  });

  test("invalid absolute URLs", () => {
    expect(isAbsoluteUrl("")).toBe(false);
    expect(isAbsoluteUrl("example.com")).toBe(false);
    expect(isAbsoluteUrl("justtext")).toBe(false);
    expect(isAbsoluteUrl("/relative-path")).toBe(false);
    expect(isAbsoluteUrl("/relative/path/?x=z")).toBe(false);
    // expect(isAbsoluteUrl("http://")).toBe(false);
    // expect(isAbsoluteUrl("https:///")).toBe(false);
    // expect(isAbsoluteUrl("ftp:example.com")).toBe(false);
  });

  test("edge cases", () => {
    expect(isAbsoluteUrl("http://user:password@example.com")).toBe(true);
    expect(isAbsoluteUrl("http://localhost:3000")).toBe(true);
    expect(isAbsoluteUrl("https://192.168.1.1")).toBe(true);
    expect(isAbsoluteUrl("http://example.com/path?query=1#fragment")).toBe(
      true,
    );
    expect(isAbsoluteUrl("mailto:user@domain.com")).toBe(true);
  });

  it.each([
    "HTTPS://EXAMPLE.COM",
    "tel:+390000000",
    "data:text/plain;base64,SGVsbG8=",
    "javascript:void(0)",
    "svn+ssh://example.com/repo",
    "chrome-extension://abcdef/page.html",
    "urn:isbn:0451450523",
    "a.b-c+d:rest",
  ])("returns true for a url with a scheme: %s", (url) => {
    expect(isAbsoluteUrl(url)).toBe(true);
  });

  it.each([
    "//example.com/protocol-relative",
    "./relative",
    "../parent",
    "#hash",
    "?query=1",
    "1http://example.com",
    "-scheme:rest",
    "+scheme:rest",
    " https://example.com",
  ])("returns false for a url without a valid scheme: %s", (url) => {
    expect(isAbsoluteUrl(url)).toBe(false);
  });
});
