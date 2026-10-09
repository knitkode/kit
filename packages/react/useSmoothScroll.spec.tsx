import { act } from "react";
import { createRoot } from "react-dom/client";
import { useSmoothScroll } from "./useSmoothScroll";

// tells React to run effects synchronously inside `act()`
(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

/** jsdom does not implement `ResizeObserver` */
class FakeResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

type Scroll = ReturnType<typeof useSmoothScroll>;

const renderUseSmoothScroll = (disregardAutomaticFixedOffset?: boolean) => {
  const result: { current?: Scroll } = {};
  const Probe = ({ disregard }: { disregard?: boolean }) => {
    result.current = useSmoothScroll(disregard);
    return null;
  };
  const root = createRoot(document.createElement("div"));
  act(() => root.render(<Probe disregard={disregardAutomaticFixedOffset} />));
  return {
    scroll: (...args: Parameters<Scroll>) => result.current?.(...args),
    current: () => result.current,
    rerender: (disregard?: boolean) =>
      act(() => root.render(<Probe disregard={disregard} />)),
    unmount: () => act(() => root.unmount()),
  };
};

/** jsdom has no layout, so we define the heights and positions manually */
const addFixedHeader = (height: number) => {
  const header = document.createElement("header");
  header.setAttribute("data-fixed", "");
  Object.defineProperty(header, "offsetHeight", { value: height });
  document.body.append(header);
};

const addSection = (id: string, top: number) => {
  const section = document.createElement("section");
  section.id = id;
  section.getBoundingClientRect = () => ({ top }) as DOMRect;
  document.body.append(section);
};

describe("useSmoothScroll", () => {
  let windowScrollTo: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.stubGlobal("ResizeObserver", FakeResizeObserver);
    // jsdom does not implement `window.scrollTo`
    windowScrollTo = vi.fn();
    vi.stubGlobal("scrollTo", windowScrollTo);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    document.body.innerHTML = "";
  });

  it("smoothly scrolls to the given position", () => {
    const { scroll, unmount } = renderUseSmoothScroll();

    scroll(300);

    expect(windowScrollTo).toHaveBeenCalledExactlyOnceWith({
      top: 300,
      behavior: "smooth",
    });
    unmount();
  });

  it("adds the custom offset", () => {
    const { scroll, unmount } = renderUseSmoothScroll();

    scroll(300, -20);

    expect(windowScrollTo).toHaveBeenCalledWith({
      top: 280,
      behavior: "smooth",
    });
    unmount();
  });

  it("uses the given scroll behavior", () => {
    const { scroll, unmount } = renderUseSmoothScroll();

    scroll(100, 0, undefined, undefined, "instant");

    expect(windowScrollTo).toHaveBeenCalledWith({
      top: 100,
      behavior: "instant",
    });
    unmount();
  });

  it("calls back once the destination is reached", () => {
    const callback = vi.fn();
    const { scroll, unmount } = renderUseSmoothScroll();

    // the window is already at the top
    scroll(0, 0, callback);

    expect(callback).toHaveBeenCalledTimes(1);
    unmount();
  });

  it("scrolls to the element with the given id minus the fixed offset", () => {
    addFixedHeader(80);
    addSection("pricing", 1000);
    const { scroll, unmount } = renderUseSmoothScroll();

    scroll("pricing");

    expect(windowScrollTo).toHaveBeenCalledWith({
      top: 920,
      behavior: "smooth",
    });
    unmount();
  });

  it("adds the custom offset when scrolling to an element", () => {
    addFixedHeader(80);
    addSection("pricing", 1000);
    const { scroll, unmount } = renderUseSmoothScroll();

    scroll("pricing", -10);

    expect(windowScrollTo).toHaveBeenCalledWith({
      top: 910,
      behavior: "smooth",
    });
    unmount();
  });

  it("keeps the fixed offset into account for elements when disregarding it", () => {
    addFixedHeader(80);
    addSection("pricing", 1000);
    const { scroll, unmount } = renderUseSmoothScroll(true);

    scroll("pricing");

    expect(windowScrollTo).toHaveBeenCalledWith({
      top: 920,
      behavior: "smooth",
    });
    unmount();
  });

  it("ignores the fixed offset for positions when disregarding it", () => {
    addFixedHeader(80);
    const { scroll, unmount } = renderUseSmoothScroll(true);

    scroll(500, 5);

    expect(windowScrollTo).toHaveBeenCalledWith({
      top: 505,
      behavior: "smooth",
    });
    unmount();
  });

  it("does not scroll when the element does not exist", () => {
    const { scroll, unmount } = renderUseSmoothScroll();

    scroll("missing");

    expect(windowScrollTo).not.toHaveBeenCalled();
    unmount();
  });

  it("does not scroll without a destination", () => {
    const { scroll, unmount } = renderUseSmoothScroll();

    scroll();
    scroll("");

    expect(windowScrollTo).not.toHaveBeenCalled();
    unmount();
  });

  it("memoizes the scroll function until the option changes", () => {
    const { current, rerender, unmount } = renderUseSmoothScroll(false);
    const initial = current();

    rerender(false);
    expect(current()).toBe(initial);

    rerender(true);
    expect(current()).not.toBe(initial);
    unmount();
  });
});
