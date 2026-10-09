import { isIE } from "./isIE";

const userAgents = {
  ie10: "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0)",
  ie11: "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko",
  chrome:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  edge: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0",
  firefox:
    "Mozilla/5.0 (X11; Linux x86_64; rv:121.0) Gecko/20100101 Firefox/121.0",
};

const mockUserAgent = (userAgent: string) =>
  vi.spyOn(window.navigator, "userAgent", "get").mockReturnValue(userAgent);

/**
 * Re-import the module with `@knitkode/utils` reporting a server environment,
 * `isServer` is evaluated once when `@knitkode/utils` is loaded.
 */
const importOnServer = async () => {
  vi.resetModules();
  vi.doMock("@knitkode/utils", async (importOriginal) => ({
    ...(await importOriginal<typeof import("@knitkode/utils")>()),
    isBrowser: false,
    isServer: true,
  }));
  return (await import("./isIE")).isIE;
};

describe("isIE", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.doUnmock("@knitkode/utils");
  });

  it("detects Internet Explorer up to version 10 (MSIE)", () => {
    mockUserAgent(userAgents.ie10);

    expect(isIE()).toBe(true);
  });

  it("detects Internet Explorer 11 (Trident)", () => {
    mockUserAgent(userAgents.ie11);

    expect(isIE()).toBe(true);
  });

  it.each([
    ["chrome", userAgents.chrome],
    ["edge", userAgents.edge],
    ["firefox", userAgents.firefox],
  ])("returns false for %s", (_name, userAgent) => {
    mockUserAgent(userAgent);

    expect(isIE()).toBe(false);
  });

  it("ignores the `ssrValue` in the browser", () => {
    mockUserAgent(userAgents.chrome);

    expect(isIE(true)).toBe(false);
  });

  it("returns the `ssrValue` on the server, true by default", async () => {
    const serverIsIE = await importOnServer();
    mockUserAgent(userAgents.chrome);

    expect(serverIsIE()).toBe(true);
    expect(serverIsIE(false)).toBe(false);
  });
});
