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
  observe() {}
  unobserve() {}
  disconnect() {}
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
  { attach = true } = {},
) => {
  const renders: UseMeasureReturn[] = [];
  const Probe = () => {
    const measure = useMeasure(options);
    renders.push(measure);
    return <div ref={attach ? measure[0] : undefined} />;
  };
  const container = document.createElement("div");
  document.body.append(container);
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
