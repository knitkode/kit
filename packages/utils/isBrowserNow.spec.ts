// @vitest-environment node
import { isBrowserNow } from "./isBrowserNow";

describe("isBrowserNow", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns false where window is not declared at all, like in Node.js", () => {
    expect(isBrowserNow()).toBe(false);
  });

  it("returns true when window is defined", () => {
    vi.stubGlobal("window", {});
    expect(isBrowserNow()).toBe(true);
  });

  it("returns false when window is undefined at call time", () => {
    vi.stubGlobal("window", undefined);
    expect(isBrowserNow()).toBe(false);
  });
});
