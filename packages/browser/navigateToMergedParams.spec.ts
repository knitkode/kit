import { navigateToMergedParams } from "./navigateToMergedParams";

describe("navigateToMergedParams", () => {
  beforeEach(() => {
    history.replaceState(null, "", "/page?a=1&b=2");
  });

  it("merges the given params with the current ones", () => {
    const length = history.length;

    const queryString = navigateToMergedParams({ b: "3", c: "x y" });

    expect(queryString).toBe("?a=1&b=3&c=x%20y");
    expect(location.pathname).toBe("/page");
    expect(location.search).toBe("?a=1&b=3&c=x%20y");
    expect(history.length).toBe(length + 1);
  });

  it("removes the params set to null", () => {
    expect(navigateToMergedParams({ a: null })).toBe("?b=2");
    expect(location.search).toBe("?b=2");
  });

  it("replaces the current history entry when `replace` is true", () => {
    const length = history.length;

    navigateToMergedParams({ c: "3" }, true);

    expect(location.search).toBe("?a=1&b=2&c=3");
    expect(history.length).toBe(length);
  });

  it("keeps the current params without arguments", () => {
    expect(navigateToMergedParams()).toBe("?a=1&b=2");
    expect(location.search).toBe("?a=1&b=2");
  });

  it("decodes the current params before merging them", () => {
    history.replaceState(null, "", "/page?q=hello%20world");

    expect(navigateToMergedParams({ p: "2" })).toBe("?q=hello%20world&p=2");
  });
});
