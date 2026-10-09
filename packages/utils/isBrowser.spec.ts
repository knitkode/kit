import { isBrowser } from "./isBrowser";

describe("isBrowser", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it("is true when window is defined", () => {
    expect(isBrowser).toBe(true);
  });

  it("is false when window is not defined", async () => {
    vi.stubGlobal("window", undefined);
    vi.resetModules();
    const fresh = await import("./isBrowser");
    expect(fresh.isBrowser).toBe(false);
    expect(fresh.default).toBe(false);
  });
});
