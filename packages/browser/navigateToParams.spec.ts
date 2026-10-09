import { navigateToParams } from "./navigateToParams";

/**
 * Re-import the module with `@knitkode/utils` reporting a server environment,
 * `isBrowser` is evaluated once when `@knitkode/utils` is loaded.
 */
const importOnServer = async () => {
  vi.resetModules();
  vi.doMock("@knitkode/utils", async (importOriginal) => ({
    ...(await importOriginal<typeof import("@knitkode/utils")>()),
    isBrowser: false,
    isServer: true,
  }));
  return (await import("./navigateToParams")).navigateToParams;
};

describe("navigateToParams", () => {
  beforeEach(() => {
    history.replaceState(null, "", "/page?old=1#hash");
  });

  afterEach(() => {
    vi.doUnmock("@knitkode/utils");
  });

  it("pushes the current pathname with the given params", () => {
    const length = history.length;

    const queryString = navigateToParams({ a: 1, b: "x y", c: null });

    expect(queryString).toBe("?a=1&b=x%20y");
    expect(location.pathname).toBe("/page");
    expect(location.search).toBe("?a=1&b=x%20y");
    expect(history.length).toBe(length + 1);
  });

  it("replaces the current history entry when `replace` is true", () => {
    const length = history.length;

    navigateToParams({ a: 1 }, true);

    expect(location.search).toBe("?a=1");
    expect(history.length).toBe(length);
  });

  it("accepts the params as a query string", () => {
    expect(navigateToParams("?q=search")).toBe("?q=search");
    expect(location.search).toBe("?q=search");
  });

  it("removes all the params without arguments", () => {
    expect(navigateToParams()).toBe("");
    expect(location.search).toBe("");
    expect(location.pathname).toBe("/page");
  });

  it("only returns the query string outside of the browser", async () => {
    const serverNavigateToParams = await importOnServer();
    const href = location.href;

    expect(serverNavigateToParams({ a: 1 })).toBe("?a=1");
    expect(location.href).toBe(href);
  });
});
