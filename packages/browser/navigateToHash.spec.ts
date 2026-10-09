import { navigateToHash } from "./navigateToHash";

describe("navigateToHash", () => {
  beforeEach(() => {
    history.replaceState(null, "", "/page");
  });

  it("sets the hash replacing the current history entry", () => {
    const length = history.length;

    navigateToHash("section");

    expect(location.pathname).toBe("/page");
    expect(location.hash).toBe("#section");
    expect(history.length).toBe(length);
  });

  it("removes the hash when called without arguments", () => {
    history.replaceState(null, "", "/page#section");

    navigateToHash();

    expect(location.hash).toBe("");
    expect(location.href).toBe(`${location.origin}/page`);
  });

  it("keeps the current history state", () => {
    history.replaceState({ scroll: 10 }, "", "/page");

    navigateToHash("section");

    expect(history.state).toEqual({ scroll: 10 });
  });

  it("keeps the query string", () => {
    history.replaceState(null, "", "/page?a=1&b=2");

    navigateToHash("section");

    expect(location.search).toBe("?a=1&b=2");
    expect(location.href).toBe(`${location.origin}/page?a=1&b=2#section`);
  });
});
