import { renderToStaticMarkup } from "react-dom/server";
import { Meta } from "./Meta";

const getViewportContent = (markup: string) => {
  const template = document.createElement("template");
  template.innerHTML = markup;
  const meta = template.content.querySelector('meta[name="viewport"]');
  return meta?.getAttribute("content");
};

describe("Meta", () => {
  it("renders a single viewport meta tag", () => {
    const template = document.createElement("template");
    template.innerHTML = renderToStaticMarkup(<Meta />);

    expect(template.content.children).toHaveLength(1);
    expect(template.content.firstElementChild?.tagName).toBe("META");
    expect(template.content.firstElementChild?.getAttribute("name")).toBe(
      "viewport",
    );
  });

  it("disables user scaling by default", () => {
    expect(getViewportContent(renderToStaticMarkup(<Meta />))).toBe(
      "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
    );
  });

  it("disables user scaling when zoom is false", () => {
    expect(
      getViewportContent(renderToStaticMarkup(<Meta zoom={false} />)),
    ).toBe(
      "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
    );
  });

  it("omits user-scalable=0 when zoom is enabled", () => {
    const content = getViewportContent(renderToStaticMarkup(<Meta zoom />));

    expect(content).toBe(
      "width=device-width, initial-scale=1, maximum-scale=1",
    );
    expect(content).not.toContain("user-scalable");
  });
});
