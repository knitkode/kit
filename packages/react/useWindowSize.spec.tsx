import { act } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { useWindowSize } from "./useWindowSize";

// tells React to run effects synchronously inside `act()`
(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const results: Array<readonly [number, number]> = [];

const Probe = ({ wait, immediate }: { wait?: number; immediate?: boolean }) => {
  const size = useWindowSize(wait, immediate);
  results.push(size);
  return (
    <i>
      {size[0]}x{size[1]}
    </i>
  );
};

const latest = () => results[results.length - 1];

const originalWidth = Object.getOwnPropertyDescriptor(window, "innerWidth");
const originalHeight = Object.getOwnPropertyDescriptor(window, "innerHeight");

const setWindowSize = (width: number, height: number) => {
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, "innerHeight", {
    configurable: true,
    value: height,
  });
};

const resize = (width: number, height: number) => {
  setWindowSize(width, height);
  act(() => {
    window.dispatchEvent(new Event("resize"));
  });
};

describe("useWindowSize", () => {
  beforeEach(() => {
    results.length = 0;
    setWindowSize(1024, 768);
  });

  afterEach(() => {
    if (originalWidth)
      Object.defineProperty(window, "innerWidth", originalWidth);
    if (originalHeight)
      Object.defineProperty(window, "innerHeight", originalHeight);
    vi.useRealTimers();
  });

  it("returns zeros when rendered on the server", () => {
    expect(renderToStaticMarkup(<Probe />)).toBe("<i>0x0</i>");
  });

  it("returns the window inner size once mounted", () => {
    const root = createRoot(document.createElement("div"));
    act(() => root.render(<Probe />));

    expect(latest()).toEqual([1024, 768]);

    act(() => root.unmount());
  });

  it("updates on every window resize", () => {
    const root = createRoot(document.createElement("div"));
    act(() => root.render(<Probe />));

    resize(800, 600);
    expect(latest()).toEqual([800, 600]);

    resize(320, 640);
    expect(latest()).toEqual([320, 640]);

    act(() => root.unmount());
  });

  it("debounces the updates when a wait is given", () => {
    vi.useFakeTimers();
    const root = createRoot(document.createElement("div"));
    act(() => root.render(<Probe wait={200} />));

    resize(800, 600);
    act(() => vi.advanceTimersByTime(100));
    resize(700, 500);
    act(() => vi.advanceTimersByTime(199));
    expect(latest()).toEqual([1024, 768]);

    act(() => vi.advanceTimersByTime(1));
    expect(latest()).toEqual([700, 500]);

    act(() => root.unmount());
  });

  it("updates on the leading edge when immediate is set", () => {
    vi.useFakeTimers();
    const root = createRoot(document.createElement("div"));
    act(() => root.render(<Probe wait={200} immediate />));

    resize(800, 600);
    expect(latest()).toEqual([800, 600]);

    resize(700, 500);
    act(() => vi.advanceTimersByTime(500));
    expect(latest()).toEqual([800, 600]);

    act(() => root.unmount());
  });

  it("removes the resize listener on unmount", () => {
    const readWidth = vi.fn(() => 500);
    const root = createRoot(document.createElement("div"));
    act(() => root.render(<Probe />));
    act(() => root.unmount());
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      get: readWidth,
    });

    act(() => {
      window.dispatchEvent(new Event("resize"));
    });

    expect(readWidth).not.toHaveBeenCalled();
  });

  it("removes the debounced resize listener on unmount", () => {
    vi.useFakeTimers();
    const readWidth = vi.fn(() => 500);
    const root = createRoot(document.createElement("div"));
    act(() => root.render(<Probe wait={100} />));
    act(() => root.unmount());
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      get: readWidth,
    });

    act(() => {
      window.dispatchEvent(new Event("resize"));
      vi.advanceTimersByTime(100);
    });

    expect(readWidth).not.toHaveBeenCalled();
  });
});
