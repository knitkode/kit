import { getOffset } from "./getOffset";

type Box = {
  offsetTop?: number;
  offsetLeft?: number;
  scrollTop?: number;
  scrollLeft?: number;
  offsetParent?: Element | null;
};

describe("getOffset", () => {
  const $ = (selector: string) => {
    const el = document.querySelector<HTMLElement>(selector);
    if (!el) throw new Error(`missing fixture ${selector}`);
    return el;
  };

  const layout = (el: HTMLElement, box: Box) => {
    vi.spyOn(el, "offsetTop", "get").mockReturnValue(box.offsetTop ?? 0);
    vi.spyOn(el, "offsetLeft", "get").mockReturnValue(box.offsetLeft ?? 0);
    vi.spyOn(el, "scrollTop", "get").mockReturnValue(box.scrollTop ?? 0);
    vi.spyOn(el, "scrollLeft", "get").mockReturnValue(box.scrollLeft ?? 0);
    vi.spyOn(el, "offsetParent", "get").mockReturnValue(
      box.offsetParent ?? null,
    );
  };

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="container">
        <div id="wrapper">
          <div id="target"></div>
        </div>
      </div>
    `;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = "";
  });

  test("returns zero offsets when there is no layout", () => {
    expect(getOffset($("#target"))).toEqual({ top: 0, left: 0 });
  });

  test("returns the element offsets when it has no offset parent", () => {
    layout($("#target"), { offsetTop: 30, offsetLeft: 12 });

    expect(getOffset($("#target"))).toEqual({ top: 30, left: 12 });
  });

  test("sums the offsets of the whole offset parents chain", () => {
    layout($("#target"), {
      offsetTop: 30,
      offsetLeft: 12,
      offsetParent: $("#wrapper"),
    });
    layout($("#wrapper"), {
      offsetTop: 100,
      offsetLeft: 40,
      offsetParent: $("#container"),
    });
    layout($("#container"), { offsetTop: 200, offsetLeft: 8 });

    expect(getOffset($("#target"))).toEqual({ top: 330, left: 60 });
  });

  test("subtracts the scroll of the offset parents", () => {
    layout($("#target"), {
      offsetTop: 300,
      offsetLeft: 20,
      offsetParent: $("#container"),
    });
    layout($("#container"), {
      offsetTop: 100,
      offsetLeft: 10,
      scrollTop: 250,
      scrollLeft: 5,
    });

    expect(getOffset($("#target"))).toEqual({ top: 150, left: 25 });
  });

  test("ignores the scroll of the element itself", () => {
    layout($("#target"), {
      offsetTop: 30,
      offsetLeft: 12,
      scrollTop: 50,
      scrollLeft: 7,
      offsetParent: $("#container"),
    });
    layout($("#container"), {
      offsetTop: 100,
      offsetLeft: 10,
      scrollTop: 20,
      scrollLeft: 4,
    });
    layout($("#wrapper"), { offsetTop: 40, scrollTop: 300 });

    expect(getOffset($("#target"))).toEqual({ top: 110, left: 18 });
    expect(getOffset($("#container"))).toEqual({ top: 100, left: 10 });
    expect(getOffset($("#wrapper"))).toEqual({ top: 40, left: 0 });
  });
});
