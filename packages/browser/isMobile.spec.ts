import { isMobile } from "./isMobile";

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
  return (await import("./isMobile")).isMobile;
};

describe("isMobile", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.doUnmock("@knitkode/utils");
  });

  it.each([
    [
      "Android",
      "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
    ],
    [
      "iPhone",
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1",
    ],
    [
      "iPad",
      "Mozilla/5.0 (iPad; CPU OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
    ],
    [
      "BlackBerry",
      "Mozilla/5.0 (BlackBerry; U; BlackBerry 9900; en) AppleWebKit/534.11+ (KHTML, like Gecko) Version/7.1.0.346 Mobile Safari/534.11+",
    ],
    [
      "IEMobile",
      "Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch)",
    ],
    ["Opera Mini", "Opera/9.80 (J2ME/MIDP; Opera Mini/9.80/22.478; U; en)"],
  ])("detects %s", (_name, userAgent) => {
    mockUserAgent(userAgent);

    expect(isMobile()).toBe(true);
  });

  it.each([
    [
      "desktop Chrome",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    ],
    [
      "desktop Safari",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15",
    ],
    [
      "desktop Firefox",
      "Mozilla/5.0 (X11; Linux x86_64; rv:121.0) Gecko/20100101 Firefox/121.0",
    ],
  ])("returns false for %s", (_name, userAgent) => {
    mockUserAgent(userAgent);

    expect(isMobile()).toBe(false);
  });

  it("matches the user agent case insensitively", () => {
    mockUserAgent("some-ANDROID-device");

    expect(isMobile()).toBe(true);
  });

  it("returns the `ssrValue` on the server, true by default", async () => {
    const serverIsMobile = await importOnServer();
    mockUserAgent("Mozilla/5.0 (X11; Linux x86_64)");

    expect(serverIsMobile()).toBe(true);
    expect(serverIsMobile(false)).toBe(false);
  });
});
