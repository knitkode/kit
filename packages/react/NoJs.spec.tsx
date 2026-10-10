import { renderToStaticMarkup } from "react-dom/server";
import { NoJs } from "./NoJs";

const getScript = () => {
  const template = document.createElement("template");
  template.innerHTML = renderToStaticMarkup(<NoJs />);
  return template.content.querySelector("script");
};

/** Runs the inline script against the current jsdom document */
const runScript = () => {
  const code = getScript()?.textContent ?? "";
  new Function(code)();
};

describe("NoJs", () => {
  const html = document.documentElement;
  let initialClassName = "";

  beforeEach(() => {
    initialClassName = html.className;
  });

  afterEach(() => {
    html.className = initialClassName;
  });

  it("renders an inline script with the no-js id", () => {
    const script = getScript();

    expect(script).not.toBeNull();
    expect(script?.id).toBe("no-js");
    expect(script?.getAttribute("src")).toBeNull();
    expect(script?.textContent).toContain("no-js");
  });

  it("replaces the no-js class with js on the html element", () => {
    html.className = "no-js";

    runScript();

    expect(html.className).toBe("js");
  });

  it("keeps the classes that follow no-js, separated from js", () => {
    html.className = "no-js foo";

    runScript();

    expect(html.classList).toHaveLength(2);
    expect(html.classList.contains("foo")).toBe(true);
    expect(html.classList.contains("js")).toBe(true);
  });

  it("adds js once, keeping the other classes, without a no-js class", () => {
    html.className = "foo";

    runScript();
    runScript();

    expect(html.className).toBe("foo js");
  });

  it("keeps the classes that precede no-js", () => {
    html.className = "theme-dark no-js";

    runScript();

    expect(html.classList.contains("theme-dark")).toBe(true);
    expect(html.classList.contains("js")).toBe(true);
    expect(html.classList.contains("no-js")).toBe(false);
  });
});
