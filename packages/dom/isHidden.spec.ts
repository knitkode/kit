import { isHidden } from "./isHidden";

describe("isHidden", () => {
  let el: HTMLDivElement;

  beforeEach(() => {
    el = document.createElement("div");
    document.body.appendChild(el);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = "";
  });

  test("returns true when no element is given", () => {
    expect(isHidden()).toBe(true);
    expect(isHidden(undefined)).toBe(true);
  });

  test("returns true when the element has no offset parent (not rendered)", () => {
    vi.spyOn(el, "offsetParent", "get").mockReturnValue(null);

    expect(isHidden(el)).toBe(true);
  });

  test("returns false when the element is rendered", () => {
    vi.spyOn(el, "offsetParent", "get").mockReturnValue(document.body);

    expect(isHidden(el)).toBe(false);
  });
});
