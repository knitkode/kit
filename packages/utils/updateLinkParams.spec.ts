import { updateLinkParams } from "./updateLinkParams";

describe("updateLinkParams", () => {
  it("updates the anchor href and returns it", () => {
    const $anchor = document.createElement("a");
    $anchor.href = "https://example.com/page?a=1";

    const href = updateLinkParams($anchor, { b: "2" });

    expect(href).toBe("https://example.com/page?a=1&b=2");
    expect($anchor.href).toBe("https://example.com/page?a=1&b=2");
  });

  it("removes the params set to null", () => {
    const $anchor = document.createElement("a");
    $anchor.href = "https://example.com/page?a=1&b=2";

    expect(updateLinkParams($anchor, { a: null })).toBe(
      "https://example.com/page?b=2",
    );
    expect($anchor.getAttribute("href")).toBe("https://example.com/page?b=2");
  });

  it("resolves relative hrefs against the document location", () => {
    const $anchor = document.createElement("a");
    $anchor.setAttribute("href", "/relative");

    expect(updateLinkParams($anchor, { x: 1 })).toBe(
      `${location.origin}/relative?x=1`,
    );
  });
});
