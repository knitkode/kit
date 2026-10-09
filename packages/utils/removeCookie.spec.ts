import { readCookie } from "./readCookie";
import { removeCookie } from "./removeCookie";

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

  it("clears the value of the cookie", () => {
    document.cookie = "a=1; path=/";
    document.cookie = "b=2; path=/";
    removeCookie("a");
    expect(readCookie("a")).toBeFalsy();
    expect(readCookie("b")).toBe("2");
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
