import { getOffsetTopSlim } from "./getOffsetTopSlim";

describe("getOffsetTopSlim", () => {
  let el: HTMLDivElement;

  beforeEach(() => {
    el = document.createElement("div");
    document.body.appendChild(el);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = "";
  });

  test("adds the window scroll to the element top relative to the viewport", () => {
    vi.spyOn(el, "getBoundingClientRect").mockReturnValue(
      new DOMRect(0, 50, 100, 20),
    );
    vi.spyOn(window, "scrollY", "get").mockReturnValue(200);

    expect(getOffsetTopSlim(el)).toBe(250);
  });

  test("handles elements scrolled above the viewport", () => {
    vi.spyOn(el, "getBoundingClientRect").mockReturnValue(
      new DOMRect(0, -150, 100, 20),
    );
    vi.spyOn(window, "scrollY", "get").mockReturnValue(400);

    expect(getOffsetTopSlim(el)).toBe(250);
  });

  test("returns the viewport top when the window is not scrolled", () => {
    vi.spyOn(el, "getBoundingClientRect").mockReturnValue(
      new DOMRect(0, 75, 100, 20),
    );

    expect(getOffsetTopSlim(el)).toBe(75);
  });
});
