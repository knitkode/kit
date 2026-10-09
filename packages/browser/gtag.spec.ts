import { gtag } from "./gtag";

describe("gtag", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("forwards all the arguments to `window.gtag`", () => {
    const windowGtag = vi.fn();
    vi.stubGlobal("gtag", windowGtag);

    gtag("config", "G-123", { send_page_view: false });

    expect(windowGtag).toHaveBeenCalledTimes(1);
    expect(windowGtag).toHaveBeenCalledWith("config", "G-123", {
      send_page_view: false,
    });
  });

  it("does nothing when `window.gtag` is not defined", () => {
    expect("gtag" in window).toBe(false);
    expect(() => gtag("event", "click")).not.toThrow();
  });
});
