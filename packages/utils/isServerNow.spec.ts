// @vitest-environment node
import { isServerNow } from "./isServerNow";

describe("isServerNow", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns true where window is not declared at all, like in Node.js", () => {
    expect(isServerNow()).toBe(true);
  });

  it("returns false when window is defined", () => {
    vi.stubGlobal("window", {});
    expect(isServerNow()).toBe(false);
  });

  it("returns true when window is undefined at call time", () => {
    vi.stubGlobal("window", undefined);
    expect(isServerNow()).toBe(true);
  });
});
