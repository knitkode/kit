import { isServer } from "./isServer";

describe("isServer", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it("is false when window is defined", () => {
    expect(isServer).toBe(false);
  });

  it("is true when window is not defined", async () => {
    vi.stubGlobal("window", undefined);
    vi.resetModules();
    const fresh = await import("./isServer");
    expect(fresh.isServer).toBe(true);
    expect(fresh.default).toBe(true);
  });
});
