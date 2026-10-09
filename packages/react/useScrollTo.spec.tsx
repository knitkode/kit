import { useScrollTo } from "./useScrollTo";

/** jsdom has no layout, so we define the offsets chain manually */
const setOffset = (
  element: HTMLElement,
  offsetTop: number,
  offsetParent: Element | null,
) => {
  Object.defineProperty(element, "offsetTop", {
    configurable: true,
    value: offsetTop,
  });
  Object.defineProperty(element, "offsetParent", {
    configurable: true,
    value: offsetParent,
  });
};

describe("useScrollTo", () => {
  let scroll: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // jsdom does not implement `window.scroll`
    scroll = vi.fn();
    vi.stubGlobal("scroll", scroll);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    document.body.innerHTML = "";
  });

  it("scrolls the window to the element's distance from the document top", () => {
    const section = document.createElement("section");
    const target = document.createElement("div");
    target.id = "target";
    section.append(target);
    document.body.append(section);
    setOffset(target, 120, section);
    setOffset(section, 300, null);

    useScrollTo("target");

    expect(scroll).toHaveBeenCalledExactlyOnceWith(0, 420);
  });

  it("subtracts the given offset", () => {
    const target = document.createElement("div");
    target.id = "target";
    document.body.append(target);
    setOffset(target, 500, document.body);
    setOffset(document.body, 0, null);

    useScrollTo("target", 80);

    expect(scroll).toHaveBeenCalledExactlyOnceWith(0, 420);
  });

  it("scrolls to the top when the element does not exist", () => {
    useScrollTo("missing");

    expect(scroll).toHaveBeenCalledExactlyOnceWith(0, 0);
  });
});
