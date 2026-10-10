import { readCookie } from "./readCookie";
import { removeCookie } from "./removeCookie";
import { setCookie } from "./setCookie";

const clearCookies = () => {
  for (const cookie of document.cookie.split("; ")) {
    const name = cookie.split("=")[0];
    if (name) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    }
  }
};

describe("removeCookie", () => {
  afterEach(() => {
    clearCookies();
    vi.restoreAllMocks();
  });

  it("removes the cookie", () => {
    document.cookie = "a=1; path=/";
    document.cookie = "b=2; path=/";
    removeCookie("a");
    expect(readCookie("a")).toBeUndefined();
    expect(readCookie("b")).toBe("2");
    expect(document.cookie).toBe("b=2");
  });

  it("removes a cookie written by setCookie", () => {
    setCookie("a", "1");
    removeCookie("a");
    expect(readCookie("a")).toBeUndefined();
    expect(document.cookie).toBe("");
  });

  it("writes an expiry date in the past", () => {
    const setter = vi.spyOn(document, "cookie", "set");
    removeCookie("a");
    const expires = setter.mock.calls[0][0].match(/; expires=([^;]+)/)?.[1];
    expect(expires).toMatch(/ GMT$/);
    expect(new Date(expires as string).getTime()).toBeLessThan(Date.now());
  });

  it("targets the root path by default", () => {
    const setter = vi.spyOn(document, "cookie", "set");
    removeCookie("a");
    expect(setter).toHaveBeenCalledTimes(1);
    expect(setter.mock.calls[0][0]).toMatch(/^a=;/);
    expect(setter.mock.calls[0][0]).toContain("; path=/");
  });

  it("forwards the given attributes", () => {
    const setter = vi.spyOn(document, "cookie", "set");
    removeCookie("a", { path: "/docs", domain: "example.com" });
    expect(setter.mock.calls[0][0]).toContain("; path=/docs");
    expect(setter.mock.calls[0][0]).toContain("; domain=example.com");
  });
});
