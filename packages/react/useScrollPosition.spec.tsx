import { act } from "react";
import { createRoot } from "react-dom/client";
import { useScrollPosition } from "./useScrollPosition";

// tells React to run effects synchronously inside `act()`
(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

type Position = { x: number; y: number };
type Effect = (current: Position, previous: Position) => void;
type ElementRef = React.MutableRefObject<HTMLElement | undefined>;

const originalScrollX = Object.getOwnPropertyDescriptor(window, "scrollX");
const originalScrollY = Object.getOwnPropertyDescriptor(window, "scrollY");

const setWindowScroll = (x: number, y: number) => {
  Object.defineProperty(window, "scrollX", { configurable: true, value: x });
  Object.defineProperty(window, "scrollY", { configurable: true, value: y });
};

/** jsdom has no layout, so we define the element's position */
const setRect = (element: HTMLElement, x: number, y: number) => {
  element.getBoundingClientRect = () =>
    ({ x, y, left: x, top: y, width: 0, height: 0 }) as DOMRect;
};

const scroll = (target: EventTarget = window) =>
  act(() => {
    target.dispatchEvent(new Event("scroll"));
  });

type ProbeProps = {
  effect: Effect;
  deps?: React.DependencyList;
  element?: ElementRef;
  boundingElement?: ElementRef;
  wait?: number;
};

const Probe = ({
  effect,
  deps,
  element,
  boundingElement,
  wait,
}: ProbeProps) => {
  useScrollPosition(effect, deps, element, boundingElement, wait);
  return null;
};

describe("useScrollPosition", () => {
  const roots: Array<() => void> = [];

  const render = (props: ProbeProps) => {
    const root = createRoot(document.createElement("div"));
    act(() => root.render(<Probe {...props} />));
    let mounted = true;
    const unmount = () => {
      if (mounted) act(() => root.unmount());
      mounted = false;
    };
    roots.push(unmount);
    return {
      rerender: (next: ProbeProps) =>
        act(() => root.render(<Probe {...next} />)),
      unmount,
    };
  };

  beforeEach(() => {
    setWindowScroll(0, 0);
  });

  afterEach(() => {
    for (const unmount of roots.splice(0)) unmount();
    if (originalScrollX)
      Object.defineProperty(window, "scrollX", originalScrollX);
    if (originalScrollY)
      Object.defineProperty(window, "scrollY", originalScrollY);
    vi.useRealTimers();
    document.body.innerHTML = "";
  });

  it("does not call the effect before scrolling", () => {
    const effect = vi.fn<Effect>();

    render({ effect });

    expect(effect).not.toHaveBeenCalled();
  });

  it("calls the effect with the current and previous window positions", () => {
    const effect = vi.fn<Effect>();
    render({ effect });

    setWindowScroll(0, 120);
    scroll();
    expect(effect).toHaveBeenLastCalledWith({ x: 0, y: 120 }, { x: 0, y: 0 });

    setWindowScroll(30, 200);
    scroll();
    expect(effect).toHaveBeenLastCalledWith(
      { x: 30, y: 200 },
      { x: 0, y: 120 },
    );
    expect(effect).toHaveBeenCalledTimes(2);
  });

  it("starts from the window position at mount", () => {
    const effect = vi.fn<Effect>();
    setWindowScroll(0, 500);
    render({ effect });

    setWindowScroll(0, 450);
    scroll();

    expect(effect).toHaveBeenCalledWith({ x: 0, y: 450 }, { x: 0, y: 500 });
  });

  it("throttles the effect calls with `wait`", () => {
    vi.useFakeTimers();
    const effect = vi.fn<Effect>();
    render({ effect, wait: 100 });

    setWindowScroll(0, 10);
    scroll();
    setWindowScroll(0, 20);
    scroll();
    setWindowScroll(0, 30);
    scroll();
    expect(effect).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(100));
    expect(effect).toHaveBeenCalledExactlyOnceWith(
      { x: 0, y: 30 },
      { x: 0, y: 0 },
    );

    setWindowScroll(0, 40);
    scroll();
    act(() => vi.advanceTimersByTime(100));
    expect(effect).toHaveBeenLastCalledWith({ x: 0, y: 40 }, { x: 0, y: 30 });
    expect(effect).toHaveBeenCalledTimes(2);
  });

  it("cancels the pending throttled call on unmount", () => {
    vi.useFakeTimers();
    const effect = vi.fn<Effect>();
    const { unmount } = render({ effect, wait: 100 });

    setWindowScroll(0, 10);
    scroll();
    unmount();
    act(() => vi.advanceTimersByTime(100));

    expect(effect).not.toHaveBeenCalled();
  });

  it("measures the element position relative to the scrolling bounding element", () => {
    const container = document.createElement("div");
    const target = document.createElement("div");
    container.append(target);
    document.body.append(container);
    setRect(container, 0, 0);
    setRect(target, 0, 0);
    const effect = vi.fn<Effect>();
    render({
      effect,
      element: { current: target },
      boundingElement: { current: container },
    });

    setRect(target, -15, -250);
    scroll(container);

    expect(effect).toHaveBeenCalledTimes(1);
    expect(effect.mock.calls[0]?.[0]).toEqual({ x: 15, y: 250 });
  });

  it("listens to the bounding element scroll instead of the window", () => {
    const container = document.createElement("div");
    document.body.append(container);
    setRect(container, 0, 0);
    const effect = vi.fn<Effect>();
    render({ effect, boundingElement: { current: container } });

    scroll(window);
    expect(effect).not.toHaveBeenCalled();

    scroll(container);
    expect(effect).toHaveBeenCalledTimes(1);
  });

  it("uses the effect captured with the current deps", () => {
    const first = vi.fn<Effect>();
    const second = vi.fn<Effect>();
    const { rerender } = render({ effect: first, deps: [1] });

    rerender({ effect: second, deps: [2] });
    setWindowScroll(0, 10);
    scroll();

    expect(second).toHaveBeenCalledTimes(1);
    expect(second.mock.calls[0]?.[0]).toEqual({ x: 0, y: 10 });
  });
});
