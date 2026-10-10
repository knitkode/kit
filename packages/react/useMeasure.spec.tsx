import { act } from "react";
import { createRoot } from "react-dom/client";
import {
  type UseMeasureOptions,
  type UseMeasureReturn,
  useMeasure,
} from "./useMeasure";

// tells React to run effects synchronously inside `act()`
(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

/** jsdom does not implement `ResizeObserver` */
class FakeResizeObserver {
  static instances: FakeResizeObserver[] = [];
  observed: Element[] = [];
  connected = true;

  constructor(public callback: ResizeObserverCallback) {
    FakeResizeObserver.instances.push(this);
  }

  observe(element: Element) {
    this.observed.push(element);
  }

  unobserve() {}

  disconnect() {
    this.connected = false;
  }

  /** The connected observers of the given element */
  static of(element: Element | null) {
    return FakeResizeObserver.instances.filter(
      (observer) =>
        observer.connected && element && observer.observed.includes(element),
    );
  }

  /** Simulates a resize of the observed elements */
  resize() {
    this.callback([], this as unknown as ResizeObserver);
  }
}

const zeroBounds = {
  left: 0,
  top: 0,
  width: 0,
  height: 0,
  bottom: 0,
  right: 0,
  x: 0,
  y: 0,
};

const createRect = (x: number, y: number, width: number, height: number) => ({
  x,
  y,
  width,
  height,
  top: y,
  left: x,
  right: x + width,
  bottom: y + height,
});

/** jsdom has no layout, so we make every element return the given rect */
let currentRect = createRect(0, 0, 0, 0);
const getBoundingClientRect = vi.fn(
  () => ({ ...currentRect, toJSON: () => currentRect }) as DOMRect,
);

const renderUseMeasure = (
  options?: UseMeasureOptions,
  {
    attach = true,
    parent = document.body as HTMLElement,
    hook = useMeasure,
  } = {},
) => {
  const renders: UseMeasureReturn[] = [];
  const Probe = () => {
    const measure = hook(options);
    renders.push(measure);
    return <div ref={attach ? measure[0] : undefined} />;
  };
  const container = document.createElement("div");
  parent.append(container);
  const root = createRoot(container);
  act(() => root.render(<Probe />));
  const latest = () => {
    const measure = renders[renders.length - 1];
    if (!measure) throw new Error("hook did not render");
    return measure;
  };
  return {
    renders,
    bounds: () => latest()[1],
    forceRefresh: () => act(() => latest()[2]()),
    element: () => container.firstElementChild,
    unmount: () => {
      act(() => root.unmount());
      container.remove();
    },
  };
};

describe("useMeasure", () => {
  beforeEach(() => {
    FakeResizeObserver.instances = [];
    vi.stubGlobal("ResizeObserver", FakeResizeObserver);
    vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(
      getBoundingClientRect,
    );
    currentRect = createRect(10, 20, 300, 150);
    getBoundingClientRect.mockClear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("returns zero bounds while no element is measured", () => {
    const { bounds, unmount } = renderUseMeasure(undefined, { attach: false });

    expect(bounds()).toEqual(zeroBounds);
    expect(getBoundingClientRect).not.toHaveBeenCalled();
    unmount();
  });

  it("measures the referenced element on mount", () => {
    const { bounds, unmount } = renderUseMeasure();

    expect(bounds()).toMatchObject(createRect(10, 20, 300, 150));
    unmount();
  });

  it("re-measures the element when forcing a refresh", () => {
    const { bounds, forceRefresh, unmount } = renderUseMeasure();

    currentRect = createRect(0, 0, 640, 480);
    forceRefresh();

    expect(bounds()).toMatchObject(createRect(0, 0, 640, 480));
    unmount();
  });

  it("keeps the same bounds and does not re-render when nothing changed", () => {
    const { bounds, forceRefresh, renders, unmount } = renderUseMeasure();
    const before = bounds();
    const rendersBefore = renders.length;

    forceRefresh();

    expect(bounds()).toBe(before);
    expect(renders).toHaveLength(rendersBefore);
    unmount();
  });

  it("re-measures 100ms after the last window resize", () => {
    vi.useFakeTimers();
    const { bounds, unmount } = renderUseMeasure();

    currentRect = createRect(0, 0, 200, 100);
    act(() => {
      window.dispatchEvent(new Event("resize"));
      vi.advanceTimersByTime(99);
    });
    expect(bounds()).toMatchObject(createRect(10, 20, 300, 150));

    act(() => vi.advanceTimersByTime(1));
    expect(bounds()).toMatchObject(createRect(0, 0, 200, 100));
    unmount();
  });

  it("does not listen to window scroll by default", () => {
    vi.useFakeTimers();
    const { bounds, unmount } = renderUseMeasure();

    currentRect = createRect(10, -80, 300, 150);
    act(() => {
      window.dispatchEvent(new Event("scroll"));
      vi.advanceTimersByTime(1000);
    });

    expect(bounds()).toMatchObject(createRect(10, 20, 300, 150));
    unmount();
  });

  it("re-measures 100ms after the last window scroll with the scroll option", () => {
    vi.useFakeTimers();
    const { bounds, unmount } = renderUseMeasure({ scroll: true });

    currentRect = createRect(10, -80, 300, 150);
    act(() => {
      window.dispatchEvent(new Event("scroll"));
      vi.advanceTimersByTime(99);
    });
    expect(bounds()).toMatchObject(createRect(10, 20, 300, 150));

    act(() => vi.advanceTimersByTime(1));
    expect(bounds()).toMatchObject(createRect(10, -80, 300, 150));
    unmount();
  });

  it("re-measures when the element itself resizes", () => {
    vi.useFakeTimers();
    const { bounds, element, unmount } = renderUseMeasure();
    const [observer] = FakeResizeObserver.of(element());

    currentRect = createRect(10, 20, 120, 40);
    act(() => {
      observer?.resize();
      vi.runAllTimers();
    });

    expect(bounds()).toMatchObject(createRect(10, 20, 120, 40));
    unmount();
  });

  it("observes the element of each hook instance", () => {
    const first = renderUseMeasure();
    const second = renderUseMeasure();

    expect(FakeResizeObserver.of(first.element())).toHaveLength(1);
    expect(FakeResizeObserver.of(second.element())).toHaveLength(1);
    first.unmount();
    second.unmount();
  });

  it("disconnects the observer on unmount", () => {
    const { element, unmount } = renderUseMeasure();
    const el = element();
    const [observer] = FakeResizeObserver.of(el);

    unmount();

    expect(observer?.connected).toBe(false);
    expect(FakeResizeObserver.of(el)).toHaveLength(0);
  });

  it("still measures when ResizeObserver does not exist", async () => {
    Reflect.deleteProperty(globalThis, "ResizeObserver");
    // a fresh module, so that no state is left from the previous tests
    vi.resetModules();
    const hook = (await import("./useMeasure")).useMeasure;
    vi.useFakeTimers();
    const { bounds, unmount } = renderUseMeasure(undefined, { hook });

    expect(bounds()).toMatchObject(createRect(10, 20, 300, 150));

    currentRect = createRect(0, 0, 200, 100);
    act(() => {
      window.dispatchEvent(new Event("resize"));
      vi.runAllTimers();
    });

    expect(bounds()).toMatchObject(createRect(0, 0, 200, 100));
    unmount();
  });

  it("removes the scroll listeners it adds to the scroll containers", () => {
    const parent = document.body.appendChild(document.createElement("div"));
    parent.style.overflow = "auto";
    const added = vi.spyOn(parent, "addEventListener");
    const removed = vi.spyOn(parent, "removeEventListener");
    const { unmount } = renderUseMeasure({ scroll: true }, { parent });
    unmount();
    parent.remove();

    const scrollListeners = (spy: typeof added) =>
      spy.mock.calls
        .filter(([type]) => type === "scroll")
        .map(([, listener, options]) => [
          listener,
          typeof options === "object" ? options.capture : options,
        ]);
    expect(scrollListeners(added).length).toBeGreaterThan(0);
    expect(scrollListeners(removed)).toEqual(scrollListeners(added));
  });

  it("stops listening to window resize on unmount", () => {
    vi.useFakeTimers();
    const { unmount } = renderUseMeasure();
    unmount();
    getBoundingClientRect.mockClear();

    act(() => {
      window.dispatchEvent(new Event("resize"));
      vi.advanceTimersByTime(1000);
    });

    expect(getBoundingClientRect).not.toHaveBeenCalled();
  });
});
