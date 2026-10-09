import { navigateToHashParams } from "./navigateToHashParams";

describe("navigateToHashParams", () => {
  beforeEach(() => {
    history.replaceState(null, "", "/page");
  });

  it("returns the given hash with the given params without navigating", () => {
    history.replaceState(null, "", "/page#/current?x=1");

    expect(navigateToHashParams({ a: 1, b: "x y" }, "#/route?old=1")).toBe(
      "#/route?a=1&b=x%20y",
    );
    expect(location.hash).toBe("#/current?x=1");
  });

  it("accepts the params as a query string", () => {
    expect(navigateToHashParams("?q=search", "#/route")).toBe(
      "#/route?q=search",
    );
  });

  it("replaces the query params of `location.hash` when no hash is given", () => {
    history.replaceState(null, "", "/page#/route?old=1");

    const newHash = navigateToHashParams({ a: "1", list: [1, 2] });

    expect(newHash).toBe("#/route?a=1&list=1&list=2");
    expect(location.hash).toBe(newHash);
    expect(location.pathname).toBe("/page");
  });

  it("removes the query params of `location.hash` with empty params", () => {
    history.replaceState(null, "", "/page#/route?old=1");

    expect(navigateToHashParams()).toBe("#/route");
    expect(location.hash).toBe("#/route");
  });

  it("sets an empty hash route when there is no `location.hash`", () => {
    expect(navigateToHashParams({ a: 1 })).toBe("#/?a=1");
    expect(location.hash).toBe("#/?a=1");
  });
});
