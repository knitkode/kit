import { isTotallyScrolled } from "./isTotallyScrolled";

describe("isTotallyScrolled", () => {
  let el: HTMLDivElement;

  const scrollState = (state: {
    scrollHeight: number;
    scrollTop: number;
    clientHeight: number;
  }) => {
    vi.spyOn(el, "scrollHeight", "get").mockReturnValue(state.scrollHeight);
    vi.spyOn(el, "scrollTop", "get").mockReturnValue(state.scrollTop);
    vi.spyOn(el, "clientHeight", "get").mockReturnValue(state.clientHeight);
  };

  beforeEach(() => {
    el = document.createElement("div");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("returns false when no element is given", () => {
    expect(isTotallyScrolled()).toBe(false);
    expect(isTotallyScrolled(null)).toBe(false);
  });

  test("returns true when the element is scrolled to the bottom", () => {
    scrollState({ scrollHeight: 500, scrollTop: 300, clientHeight: 200 });

    expect(isTotallyScrolled(el)).toBe(true);
  });

  test("returns true when the scroll overshoots by a fraction of pixel", () => {
    scrollState({ scrollHeight: 500, scrollTop: 300.5, clientHeight: 200 });

    expect(isTotallyScrolled(el)).toBe(true);
  });

  test("returns false when there is still content to scroll", () => {
    scrollState({ scrollHeight: 500, scrollTop: 299, clientHeight: 200 });

    expect(isTotallyScrolled(el)).toBe(false);
  });

  test("returns true when the content does not overflow", () => {
    scrollState({ scrollHeight: 200, scrollTop: 0, clientHeight: 200 });

    expect(isTotallyScrolled(el)).toBe(true);
  });
});
