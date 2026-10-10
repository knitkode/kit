import { act, type RefObject } from "react";
import { createRoot } from "react-dom/client";
import { useFixedOffset } from "./useFixedOffset";

// tells React to run effects synchronously inside `act()`
(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

/** jsdom does not implement `ResizeObserver` */
class FakeResizeObserver {
  static instances: FakeResizeObserver[] = [];
  observed: Element[] = [];
  disconnect = vi.fn();

  constructor(public callback: ResizeObserverCallback) {
    FakeResizeObserver.instances.push(this);
  }

  observe(element: Element) {
    this.observed.push(element);
  }

  unobserve() {}

  /** Simulates a resize of the given elements */
  resize(entries: Array<[Element, number]>) {
    this.callback(
      entries.map(
        ([target, height]) =>
          ({ target, contentRect: { height } }) as ResizeObserverEntry,
      ),
      this as unknown as ResizeObserver,
    );
  }
}

/** jsdom has no layout, so we define the elements' `offsetHeight` */
const addFixedElement = (
  height: number,
  attributes: Record<string, string> = { "data-fixed": "" },
) => {
  const element = document.createElement("div");
  for (const [name, value] of Object.entries(attributes)) {
    element.setAttribute(name, value);
  }
  Object.defineProperty(element, "offsetHeight", {
    configurable: true,
    value: height,
  });
  document.body.append(element);
  return element;
};

const setHeight = (element: HTMLElement, height: number) =>
  Object.defineProperty(element, "offsetHeight", {
    configurable: true,
    value: height,
  });

const getInjectedCss = () =>
  document.getElementById("useFixedOffset")?.innerHTML;

const renderUseFixedOffset = (selector?: string) => {
  const result: { current?: RefObject<number> } = {};
  const Probe = ({ selector }: { selector?: string }) => {
    result.current = useFixedOffset(selector);
    return null;
  };
  const root = createRoot(document.createElement("div"));
  act(() => root.render(<Probe selector={selector} />));
  return {
    offset: () => result.current?.current,
    rerender: (nextSelector?: string) =>
      act(() => root.render(<Probe selector={nextSelector} />)),
    unmount: () => act(() => root.unmount()),
  };
};

describe("useFixedOffset", () => {
  beforeEach(() => {
    FakeResizeObserver.instances = [];
    vi.stubGlobal("ResizeObserver", FakeResizeObserver);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
    document.body.innerHTML = "";
  });

  it("sums the height of the `[data-fixed]` elements on mount", () => {
    addFixedElement(50);
    addFixedElement(30);
    addFixedElement(1000, { "data-other": "" });

    const { offset, unmount } = renderUseFixedOffset();

    expect(offset()).toBe(80);
    unmount();
  });

  it("injects the offset as the html scroll-padding-top", () => {
    addFixedElement(64);

    const { unmount } = renderUseFixedOffset();

    expect(getInjectedCss()).toBe("html{scroll-padding-top: 64px}");
    expect(document.querySelectorAll("#useFixedOffset")).toHaveLength(1);
    unmount();
  });

  it("is zero without fixed elements", () => {
    const { offset, unmount } = renderUseFixedOffset();

    expect(offset()).toBe(0);
    expect(getInjectedCss()).toBe("html{scroll-padding-top: 0px}");
    unmount();
  });

  it("observes the resizes of the `[data-fixed]` elements", () => {
    const header = addFixedElement(50);
    addFixedElement(10, { "data-other": "" });

    const { unmount } = renderUseFixedOffset();

    expect(FakeResizeObserver.instances).toHaveLength(1);
    expect(FakeResizeObserver.instances[0]?.observed).toEqual([header]);
    unmount();
  });

  it("observes the elements matching a custom selector", () => {
    addFixedElement(50);
    const toolbar = addFixedElement(20, { class: "toolbar" });

    const { unmount } = renderUseFixedOffset(".toolbar");

    expect(FakeResizeObserver.instances[0]?.observed).toEqual([toolbar]);
    unmount();
  });

  it("calculates the offset from the elements matching a custom selector", () => {
    addFixedElement(50);
    addFixedElement(40, { class: "hdr" });

    const { offset, unmount } = renderUseFixedOffset(".hdr");

    expect(offset()).toBe(40);
    expect(getInjectedCss()).toBe("html{scroll-padding-top: 40px}");
    unmount();
  });

  it("updates the offset right away and the injected CSS 400ms after the element resizes", () => {
    vi.useFakeTimers();
    const header = addFixedElement(50);
    const { offset, unmount } = renderUseFixedOffset();

    setHeight(header, 72);
    act(() => FakeResizeObserver.instances[0]?.resize([[header, 72]]));

    expect(offset()).toBe(72);
    expect(getInjectedCss()).toBe("html{scroll-padding-top: 50px}");

    act(() => vi.advanceTimersByTime(400));
    expect(getInjectedCss()).toBe("html{scroll-padding-top: 72px}");
    unmount();
  });

  it("sums all the fixed elements when only some of them resize", () => {
    vi.useFakeTimers();
    const header = addFixedElement(50);
    addFixedElement(30);
    const { offset, unmount } = renderUseFixedOffset();

    setHeight(header, 72);
    act(() => {
      FakeResizeObserver.instances[0]?.resize([[header, 72]]);
      vi.runAllTimers();
    });

    expect(offset()).toBe(102);
    expect(getInjectedCss()).toBe("html{scroll-padding-top: 102px}");
    unmount();
  });

  it("debounces the CSS injection of consecutive resizes", () => {
    vi.useFakeTimers();
    const header = addFixedElement(50);
    const { unmount } = renderUseFixedOffset();
    const observer = FakeResizeObserver.instances[0];

    setHeight(header, 60);
    act(() => observer?.resize([[header, 60]]));
    act(() => vi.advanceTimersByTime(300));
    setHeight(header, 70);
    act(() => observer?.resize([[header, 70]]));
    act(() => vi.advanceTimersByTime(399));

    expect(getInjectedCss()).toBe("html{scroll-padding-top: 50px}");

    act(() => vi.advanceTimersByTime(1));
    expect(getInjectedCss()).toBe("html{scroll-padding-top: 70px}");
    unmount();
  });

  it("disconnects the observer on unmount", () => {
    addFixedElement(50);
    const { unmount } = renderUseFixedOffset();
    const observer = FakeResizeObserver.instances[0];

    expect(observer?.disconnect).not.toHaveBeenCalled();
    unmount();

    expect(observer?.disconnect).toHaveBeenCalledTimes(1);
  });

  it("observes again when the selector changes", () => {
    const header = addFixedElement(50);
    const toolbar = addFixedElement(20, { class: "toolbar" });
    const { rerender, unmount } = renderUseFixedOffset();

    rerender(".toolbar");

    const [first, second] = FakeResizeObserver.instances;
    expect(first?.disconnect).toHaveBeenCalledTimes(1);
    expect(first?.observed).toEqual([header]);
    expect(second?.observed).toEqual([toolbar]);
    unmount();
  });

  it("falls back to window resize when ResizeObserver does not exist", () => {
    Reflect.deleteProperty(globalThis, "ResizeObserver");
    vi.useFakeTimers();
    const header = addFixedElement(50);
    const { offset, unmount } = renderUseFixedOffset();
    expect(offset()).toBe(50);

    setHeight(header, 90);
    act(() => {
      window.dispatchEvent(new Event("resize"));
      vi.runAllTimers();
    });

    expect(offset()).toBe(90);
    expect(getInjectedCss()).toBe("html{scroll-padding-top: 90px}");
    unmount();
  });

  describe("when ResizeObserver is set to undefined", () => {
    beforeEach(() => {
      vi.stubGlobal("ResizeObserver", undefined);
      vi.useFakeTimers();
    });

    it("recalculates the offset on window resize", () => {
      const header = addFixedElement(50);
      const { offset, unmount } = renderUseFixedOffset();
      expect(offset()).toBe(50);

      Object.defineProperty(header, "offsetHeight", { value: 90 });
      act(() => {
        window.dispatchEvent(new Event("resize"));
        vi.runAllTimers();
      });

      expect(offset()).toBe(90);
      expect(getInjectedCss()).toBe("html{scroll-padding-top: 90px}");
      unmount();
    });

    it("stops listening to window resize on unmount", () => {
      const header = addFixedElement(50);
      const { offset, unmount } = renderUseFixedOffset();
      unmount();

      Object.defineProperty(header, "offsetHeight", { value: 90 });
      act(() => {
        window.dispatchEvent(new Event("resize"));
        vi.runAllTimers();
      });

      expect(offset()).toBe(50);
      expect(getInjectedCss()).toBe("html{scroll-padding-top: 50px}");
    });
  });
});
