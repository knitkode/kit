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
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    clearCookies();
  });

  it("writes the cookie and returns the written string", () => {
    expect(setCookie("a", "1")).toBe("a=1");
    expect(document.cookie).toBe("a=1");
    expect(readCookie("a")).toBe("1");
  });

  it("overwrites an existing cookie", () => {
    setCookie("a", "1");
    setCookie("a", "2");
    expect(document.cookie).toBe("a=2");
  });

  it("encodes the value keeping the characters allowed by RFC 6265", () => {
    expect(setCookie("a", "x y;z,w")).toBe("a=x%20y%3Bz%2Cw");
    expect(setCookie("b", "/path:#$&+<=>?@[]^`{|}")).toBe(
      "b=/path:#$&+<=>?@[]^`{|}",
    );
  });

  it("round trips the value through readCookie", () => {
    setCookie("a", "hello world; è");
    expect(readCookie("a")).toBe("hello world; è");
  });

  it("encodes the name", () => {
    expect(setCookie("my name", "1")).toBe("my%20name=1");
    expect(setCookie("fn(x)", "1")).toBe("fn%28x%29=1");
    expect(setCookie("a#$&+^`|", "1")).toBe("a#$&+^`|=1");
  });

  it("appends the string attributes", () => {
    expect(setCookie("a", "1", { path: "/docs", sameSite: "lax" })).toBe(
      "a=1; path=/docs; sameSite=lax",
    );
  });

  it("appends the boolean attributes as flags", () => {
    expect(setCookie("a", "1", { secure: true })).toBe("a=1; secure");
  });

  it("skips the falsy attributes", () => {
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
