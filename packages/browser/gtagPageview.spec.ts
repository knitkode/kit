import { gtagPageview } from "./gtagPageview";

describe("gtagPageview", () => {
  const windowGtag = vi.fn();

  beforeEach(() => {
    windowGtag.mockReset();
    vi.stubGlobal("gtag", windowGtag);
    history.replaceState(null, "", "/blog/post?ref=home");
    document.title = "My post";
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    document.title = "";
  });

  it("sends a `page_view` event with the current location and title", () => {
    gtagPageview();

    expect(windowGtag).toHaveBeenCalledWith("event", "page_view", {
      page_path: "/blog/post",
      page_title: "My post",
      page_location: `${location.origin}/blog/post?ref=home`,
    });
  });

  it("sends the given path, title and location", () => {
    gtagPageview("/custom", "Custom title", "https://example.com/custom");

    expect(windowGtag).toHaveBeenCalledWith("event", "page_view", {
      page_path: "/custom",
      page_title: "Custom title",
      page_location: "https://example.com/custom",
    });
  });

  it("falls back to the current values for the missing arguments", () => {
    gtagPageview("/custom");

    expect(windowGtag).toHaveBeenCalledWith("event", "page_view", {
      page_path: "/custom",
      page_title: "My post",
      page_location: `${location.origin}/blog/post?ref=home`,
    });
  });

  it("does nothing when `window.gtag` is not defined", () => {
    vi.unstubAllGlobals();

    expect(() => gtagPageview()).not.toThrow();
    expect(windowGtag).not.toHaveBeenCalled();
  });
});
