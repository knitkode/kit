import { navigateToUrl } from "./navigateToUrl";

describe("navigateToUrl", () => {
  beforeEach(() => {
    history.replaceState(null, "", "/");
  });

  it("pushes the given URL in the history stack", () => {
    const length = history.length;

    navigateToUrl("/page?a=1#top");

    expect(location.pathname).toBe("/page");
    expect(location.search).toBe("?a=1");
    expect(location.hash).toBe("#top");
    expect(history.length).toBe(length + 1);
  });

  it("replaces the current history entry when `replace` is true", () => {
    const length = history.length;

    navigateToUrl("/replaced", true);

    expect(location.pathname).toBe("/replaced");
    expect(history.length).toBe(length);
  });

  it("keeps the current history state", () => {
    history.replaceState({ scroll: 10 }, "", "/");

    navigateToUrl("/pushed");
    expect(history.state).toEqual({ scroll: 10 });

    navigateToUrl("/replaced", true);
    expect(history.state).toEqual({ scroll: 10 });
  });

  it("does nothing without a URL", () => {
    history.replaceState(null, "", "/current?a=1");
    const length = history.length;
    const href = location.href;

    navigateToUrl();
    navigateToUrl("", true);

    expect(location.href).toBe(href);
    expect(history.length).toBe(length);
  });
});
