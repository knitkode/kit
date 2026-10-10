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

  test.each([
    [300, 285, 15],
    [300, 300, 0],
  ])(
    "returns the scrollbar width of an element %i wide with a client width of %i",
    (offsetWidth, clientWidth, expected) => {
      const el = document.createElement("div");
      vi.spyOn(window, "innerWidth", "get").mockReturnValue(1024);
      vi.spyOn(el, "offsetWidth", "get").mockReturnValue(offsetWidth);
      vi.spyOn(el, "clientWidth", "get").mockReturnValue(clientWidth);

      expect(getScrollbarWidth(el)).toBe(expected);
    },
  );
});
