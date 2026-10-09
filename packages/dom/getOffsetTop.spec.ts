import { getOffsetTop } from "./getOffsetTop";

describe("getOffsetTop", () => {
  const $ = (selector: string) => {
    const el = document.querySelector<HTMLElement>(selector);
    if (!el) throw new Error(`missing fixture ${selector}`);
    return el;
  };

  const layout = (
    el: HTMLElement,
    offsetTop: number,
    offsetParent: Element | null,
  ) => {
    vi.spyOn(el, "offsetTop", "get").mockReturnValue(offsetTop);
    vi.spyOn(el, "offsetParent", "get").mockReturnValue(offsetParent);
  };

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="container">
        <div id="target"></div>
      </div>
    `;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = "";
  });

  test("sums the top offsets of the whole offset parents chain", () => {
    layout($("#target"), 30, $("#container"));
    layout($("#container"), 100, document.body);
    layout(document.body, 0, null);

    expect(getOffsetTop($("#target"))).toBe(130);
  });

  test("returns 0 for an element without offset parent, e.g. a hidden one", () => {
    expect(getOffsetTop($("#target"))).toBe(0);
  });

  test("never returns a negative distance", () => {
    layout($("#target"), -80, $("#container"));
    layout($("#container"), 20, null);

    expect(getOffsetTop($("#target"))).toBe(0);
  });
});
