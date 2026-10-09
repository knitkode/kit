import { calculateFixedOffset } from "./calculateFixedOffset";

describe("calculateFixedOffset", () => {
  const setHeight = (selector: string, height: number) => {
    const el = document.querySelector<HTMLElement>(selector);
    if (!el) throw new Error(`missing fixture ${selector}`);
    vi.spyOn(el, "offsetHeight", "get").mockReturnValue(height);
  };

  beforeEach(() => {
    document.body.innerHTML = `
      <header id="header" data-fixed></header>
      <nav id="nav" data-fixed class="sticky"></nav>
      <aside id="aside" class="sticky is:pinned"></aside>
      <main id="main"></main>
    `;
    setHeight("#header", 60);
    setHeight("#nav", 40);
    setHeight("#aside", 25);
    setHeight("#main", 1000);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = "";
  });

  test("sums the heights of the `[data-fixed]` elements by default", () => {
    expect(calculateFixedOffset()).toBe(100);
  });

  test("sums the heights of the elements matching a custom selector", () => {
    expect(calculateFixedOffset(".sticky")).toBe(65);
  });

  test("escapes colons in the selector", () => {
    expect(calculateFixedOffset(".is:pinned")).toBe(25);
  });

  test("returns 0 when no element matches", () => {
    expect(calculateFixedOffset(".missing")).toBe(0);
  });
});
