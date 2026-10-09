import { vitestSetNodeEnv } from "@knitkode/test/vitest";
import { readCookie } from "./readCookie";

const clearCookies = () => {
  for (const cookie of document.cookie.split("; ")) {
    const name = cookie.split("=")[0];
    if (name) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    }
  }
};

describe("readCookie", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    clearCookies();
  });

  it("returns an empty object when there are no cookies", () => {
    expect(readCookie()).toEqual({});
    expect(readCookie(null)).toEqual({});
  });

  it("reads all the cookies", () => {
    document.cookie = "a=1";
    document.cookie = "b=two";
    expect(readCookie()).toEqual({ a: "1", b: "two" });
  });

  it("reads a single cookie by name", () => {
    document.cookie = "a=1";
    document.cookie = "b=two";
    expect(readCookie("a")).toBe("1");
    expect(readCookie("b")).toBe("two");
  });

  it("returns undefined for a missing cookie", () => {
    document.cookie = "a=1";
    expect(readCookie("missing")).toBeUndefined();
  });

  it("decodes names and values", () => {
    document.cookie = "my%20name=hello%20world%21";
    expect(readCookie()).toEqual({ "my name": "hello world!" });
  });

  it("strips the quotes around values", () => {
    document.cookie = 'q="quoted"';
    expect(readCookie("q")).toBe("quoted");
  });

  it("keeps the '=' signs within values", () => {
    document.cookie = "c=x=y";
    expect(readCookie("c")).toBe("x=y");
  });

  it("skips cookies that cannot be decoded", () => {
    document.cookie = "%E0%A4%A=1";
    document.cookie = "ok=1";
    expect(readCookie()).toEqual({ ok: "1" });
  });

  it("returns empty values when document is not defined", () => {
    vi.stubGlobal("document", undefined);
    expect(readCookie()).toEqual({});
    expect(readCookie("a")).toBe("");
  });

  describe("in development", () => {
    vitestSetNodeEnv("development");

    it("warns about cookies that cannot be decoded", () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      document.cookie = "%E0%A4%A=1";
      expect(readCookie()).toEqual({});
      expect(warn).toHaveBeenCalledWith(
        "[@knitkode/utils:readCookie] failed to decode",
        "1",
      );
    });

    it("warns when document is not defined", () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      vi.stubGlobal("document", undefined);
      expect(readCookie()).toEqual({});
      expect(warn).toHaveBeenCalledWith(
        "[@knitkode/utils:readCookie] document is undefined",
      );
    });
  });
});
