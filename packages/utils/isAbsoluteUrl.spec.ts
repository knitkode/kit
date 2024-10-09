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
});
