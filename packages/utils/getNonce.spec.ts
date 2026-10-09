import { getNonce } from "./getNonce";

describe("getNonce", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns the webpack nonce when defined", () => {
    vi.stubGlobal("__webpack_nonce__", "abc123");
    expect(getNonce()).toBe("abc123");
  });

  it("returns null when the webpack nonce is undefined", () => {
    vi.stubGlobal("__webpack_nonce__", undefined);
    expect(getNonce()).toBeNull();
  });
});
