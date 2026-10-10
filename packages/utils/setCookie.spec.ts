import { vitestSetNodeEnv } from "@knitkode/test/vitest";
import { readCookie } from "./readCookie";
import { setCookie } from "./setCookie";

const clearCookies = () => {
  for (const cookie of document.cookie.split("; ")) {
    const name = cookie.split("=")[0];
    if (name) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    }
  }
};

describe("setCookie", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    clearCookies();
  });

  it("writes the cookie and returns the written string", () => {
    expect(setCookie("a", "1")).toBe("a=1; path=/");
    expect(document.cookie).toBe("a=1");
    expect(readCookie("a")).toBe("1");
  });

  it("defaults the path to the root", () => {
    expect(setCookie("p", "1")).toBe("p=1; path=/");
    expect(setCookie("p", "1", { domain: "localhost" })).toBe(
      "p=1; path=/; domain=localhost",
    );
  });

  it("writes a number of days `expires` as a UTC date", () => {
    vi.useFakeTimers({ now: new Date("2030-01-01T00:00:00Z") });
    expect(setCookie("a", "1", { expires: 7 })).toBe(
      "a=1; expires=Tue, 08 Jan 2030 00:00:00 GMT; path=/",
    );
    expect(readCookie("a")).toBe("1");
  });

  it("writes a Date `expires` as a UTC date", () => {
    const expires = new Date("2099-01-01T00:00:00Z");
    expect(setCookie("a", "1", { expires })).toBe(
      "a=1; expires=Thu, 01 Jan 2099 00:00:00 GMT; path=/",
    );
    expect(readCookie("a")).toBe("1");
  });

  it("expires the cookie with an `expires` in the past", () => {
    setCookie("a", "1");
    setCookie("b", "2");
    setCookie("a", "", { expires: -1 });
    expect(readCookie("a")).toBeUndefined();
    expect(document.cookie).toBe("b=2");
  });

  it("overwrites an existing cookie", () => {
    setCookie("a", "1");
    setCookie("a", "2");
    expect(document.cookie).toBe("a=2");
  });

  it("encodes the value keeping the characters allowed by RFC 6265", () => {
    expect(setCookie("a", "x y;z,w")).toBe("a=x%20y%3Bz%2Cw; path=/");
    expect(setCookie("b", "/path:#$&+<=>?@[]^`{|}")).toBe(
      "b=/path:#$&+<=>?@[]^`{|}; path=/",
    );
  });

  it("round trips the value through readCookie", () => {
    setCookie("a", "hello world; è");
    expect(readCookie("a")).toBe("hello world; è");
  });

  it("encodes the name", () => {
    expect(setCookie("my name", "1")).toBe("my%20name=1; path=/");
    expect(setCookie("fn(x)", "1")).toBe("fn%28x%29=1; path=/");
    expect(setCookie("a#$&+^`|", "1")).toBe("a#$&+^`|=1; path=/");
  });

  it("appends the string attributes", () => {
    expect(setCookie("a", "1", { path: "/docs", sameSite: "lax" })).toBe(
      "a=1; path=/docs; sameSite=lax",
    );
  });

  it("appends the boolean attributes as flags", () => {
    expect(setCookie("a", "1", { secure: true })).toBe("a=1; path=/; secure");
  });

  it("skips the falsy attributes, an empty path removes the default one", () => {
    expect(
      setCookie("a", "1", { secure: false, path: "", domain: undefined }),
    ).toBe("a=1");
  });

  it("cuts the attribute values at the first ';'", () => {
    expect(setCookie("a", "1", { path: "/x;domain=evil.com" })).toBe(
      "a=1; path=/x",
    );
  });

  it("returns undefined when document is not defined", () => {
    vi.stubGlobal("document", undefined);
    expect(setCookie("a", "1")).toBeUndefined();
  });

  describe("in development", () => {
    vitestSetNodeEnv("development");

    it("warns when document is not defined", () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      vi.stubGlobal("document", undefined);
      expect(setCookie("a", "1")).toBeUndefined();
      expect(warn).toHaveBeenCalledWith(
        "[@knitkode/utils:setCookie] document is undefined",
      );
    });
  });
});
