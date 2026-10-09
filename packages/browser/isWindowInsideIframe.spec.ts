import { isWindowInsideIframe } from "./isWindowInsideIframe";

describe("isWindowInsideIframe", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns false in a top level window", () => {
    expect(isWindowInsideIframe()).toBe(false);
  });

  it("returns true when the window is not the top one", () => {
    const iframe = document.createElement("iframe");
    document.body.appendChild(iframe);
    const iframeWindow = iframe.contentWindow;

    // the iframe window is a real child window of the jsdom one
    expect(iframeWindow?.self).toBe(iframeWindow);
    expect(iframeWindow?.top).not.toBe(iframeWindow);
    vi.stubGlobal("window", iframeWindow);

    expect(isWindowInsideIframe()).toBe(true);
    iframe.remove();
  });
});
