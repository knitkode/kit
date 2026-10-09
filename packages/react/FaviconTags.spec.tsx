import { renderToStaticMarkup } from "react-dom/server";
import { FaviconTags, type FaviconTagsProps } from "./FaviconTags";

const render = (props: FaviconTagsProps) => {
  const template = document.createElement("template");
  template.innerHTML = renderToStaticMarkup(<FaviconTags {...props} />);
  const fragment = template.content;
  return {
    fragment,
    attr: (selector: string, name: string) =>
      fragment.querySelector(selector)?.getAttribute(name),
  };
};

describe("FaviconTags", () => {
  it("renders the favicon links pointing to the root assets", () => {
    const { fragment } = render({ name: "Kit", color: "#111" });
    const links = [...fragment.querySelectorAll("link")].map((link) => [
      link.getAttribute("rel"),
      link.getAttribute("href"),
    ]);

    expect(links).toEqual([
      ["shortcut icon", "/favicon.ico"],
      ["apple-touch-icon", "/apple-touch-icon.png"],
      ["icon", "/favicon-32x32.png"],
      ["icon", "/favicon-16x16.png"],
      ["manifest", "/site.webmanifest"],
      ["mask-icon", "/safari-pinned-tab.svg"],
    ]);
  });

  it("renders the icon sizes and types", () => {
    const { attr } = render({ name: "Kit" });

    expect(attr('link[rel="shortcut icon"]', "type")).toBe("image/x-icon");
    expect(attr('link[rel="apple-touch-icon"]', "sizes")).toBe("180x180");
    expect(attr('link[href="/favicon-32x32.png"]', "sizes")).toBe("32x32");
    expect(attr('link[href="/favicon-16x16.png"]', "sizes")).toBe("16x16");
    expect(attr('link[href="/favicon-16x16.png"]', "type")).toBe("image/png");
  });

  it("uses the name for the application title metas", () => {
    const { attr } = render({ name: "My App" });

    expect(attr('meta[name="apple-mobile-web-app-title"]', "content")).toBe(
      "My App",
    );
    expect(attr('meta[name="application-name"]', "content")).toBe("My App");
  });

  it("falls back to the main color for every color tag", () => {
    const { attr } = render({ name: "Kit", color: "#123456" });

    expect(attr('link[rel="mask-icon"]', "color")).toBe("#123456");
    expect(attr('meta[name="msapplication-TileColor"]', "content")).toBe(
      "#123456",
    );
    expect(attr('meta[name="theme-color"]', "content")).toBe("#123456");
  });

  it("prefers the specific colors over the main color", () => {
    const { attr } = render({
      name: "Kit",
      color: "#000000",
      safariTabColor: "#aa0000",
      tileColor: "#00aa00",
      themeColor: "#0000aa",
    });

    expect(attr('link[rel="mask-icon"]', "color")).toBe("#aa0000");
    expect(attr('meta[name="msapplication-TileColor"]', "content")).toBe(
      "#00aa00",
    );
    expect(attr('meta[name="theme-color"]', "content")).toBe("#0000aa");
  });
});
