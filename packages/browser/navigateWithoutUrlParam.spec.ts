import { navigateWithoutUrlParam } from "./navigateWithoutUrlParam";

describe("navigateWithoutUrlParam", () => {
  beforeEach(() => {
    history.replaceState(null, "", "/page?a=1&b=2&c=3");
  });

  it("removes the given param from the URL", () => {
    const length = history.length;

    const queryString = navigateWithoutUrlParam("b");

    expect(queryString).toBe("?a=1&c=3");
    expect(location.pathname).toBe("/page");
    expect(location.search).toBe("?a=1&c=3");
    expect(history.length).toBe(length + 1);
  });

  it("replaces the current history entry when `replace` is true", () => {
    const length = history.length;

    navigateWithoutUrlParam("a", true);

    expect(location.search).toBe("?b=2&c=3");
    expect(history.length).toBe(length);
  });

  it("keeps the params when the given one is not in the URL", () => {
    expect(navigateWithoutUrlParam("missing")).toBe("?a=1&b=2&c=3");
    expect(location.search).toBe("?a=1&b=2&c=3");
  });

  it("keeps the params without arguments", () => {
    expect(navigateWithoutUrlParam()).toBe("?a=1&b=2&c=3");
  });

  it("removes the query string when removing the only param", () => {
    history.replaceState(null, "", "/page?a=1");

    expect(navigateWithoutUrlParam("a")).toBe("");
    expect(location.search).toBe("");
    expect(location.pathname).toBe("/page");
  });
});
