import { navigateToMergedHashParams } from "./navigateToMergedHashParams";

describe("navigateToMergedHashParams", () => {
  beforeEach(() => {
    history.replaceState(null, "", "/page#/route?a=1&b=2");
  });

  it("merges the given params with the `location.hash` ones", () => {
    const newHash = navigateToMergedHashParams({ b: "3", c: "4" });

    expect(newHash).toBe("#/route?a=1&b=3&c=4");
    expect(location.hash).toBe(newHash);
  });

  it("removes the params set to null", () => {
    expect(navigateToMergedHashParams({ a: null })).toBe("#/route?b=2");
    expect(location.hash).toBe("#/route?b=2");
  });

  it("keeps the current params without arguments", () => {
    expect(navigateToMergedHashParams()).toBe("#/route?a=1&b=2");
    expect(location.hash).toBe("#/route?a=1&b=2");
  });

  it("merges into the given hash without navigating", () => {
    expect(navigateToMergedHashParams({ y: "2" }, "#/other?x=1")).toBe(
      "#/other?x=1&y=2",
    );
    expect(location.hash).toBe("#/route?a=1&b=2");
  });
});
