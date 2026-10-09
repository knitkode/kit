import { redirectTo } from "./redirectTo";

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
  return (await import("./redirectTo")).redirectTo;
};

describe("redirectTo", () => {
  // jsdom does not implement cross document navigation, a plain object lets
  // us read the `href` assigned by `redirectTo`
  let fakeLocation: { href: string };

  beforeEach(() => {
    fakeLocation = { href: "http://localhost:3000/" };
    vi.stubGlobal("location", fakeLocation);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.doUnmock("@knitkode/utils");
  });

  it("redirects to the given URL", () => {
    redirectTo("https://example.com/path");

    expect(fakeLocation.href).toBe("https://example.com/path");
  });

  it("appends the given params as query string", () => {
    redirectTo("https://example.com/path", {
      a: 1,
      b: "x y",
      list: ["1", "2"],
      empty: null,
    });

    expect(fakeLocation.href).toBe(
      "https://example.com/path?a=1&b=x%20y&list=1&list=2",
    );
  });

  it("removes the trailing question marks from the URL", () => {
    redirectTo("/path??");
    expect(fakeLocation.href).toBe("/path");

    redirectTo("/path?", { a: 1 });
    expect(fakeLocation.href).toBe("/path?a=1");
  });

  it("does nothing outside of the browser", async () => {
    const serverRedirectTo = await importOnServer();

    serverRedirectTo("https://example.com/path", { a: 1 });

    expect(fakeLocation.href).toBe("http://localhost:3000/");
  });
});
