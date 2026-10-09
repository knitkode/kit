import { getScrollbarWidth } from "./getScrollbarWidth";

describe("getScrollbarWidth", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("returns the width of the document scrollbar", () => {
    vi.spyOn(window, "innerWidth", "get").mockReturnValue(1024);
    vi.spyOn(document.documentElement, "clientWidth", "get").mockReturnValue(
      1009,
    );

    expect(getScrollbarWidth()).toBe(15);
  });

  test("returns 0 when the document has no scrollbar", () => {
    vi.spyOn(window, "innerWidth", "get").mockReturnValue(1024);
    vi.spyOn(document.documentElement, "clientWidth", "get").mockReturnValue(
      1024,
    );

    expect(getScrollbarWidth()).toBe(0);
  });
});
