import { act } from "react";
import { createRoot } from "react-dom/client";
import { useScrollThreshold } from "./useScrollThreshold";

// tells React to run effects synchronously inside `act()`
(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

type Callback = (isAbove: boolean, isBelow: boolean) => void;

const originalScrollY = Object.getOwnPropertyDescriptor(window, "scrollY");

const scrollTo = (y: number) => {
  Object.defineProperty(window, "scrollY", { configurable: true, value: y });
  act(() => {
    window.dispatchEvent(new Event("scroll"));
  });
};

const results: boolean[] = [];

const Probe = ({
  threshold,
  callback,
}: {
  threshold?: number;
  callback?: Callback;
}) => {
  results.push(useScrollThreshold(threshold, callback));
  return null;
};

const latest = () => results[results.length - 1];

describe("useScrollThreshold", () => {
  const unmounts: Array<() => void> = [];

  const render = (threshold?: number, callback?: Callback) => {
    const root = createRoot(document.createElement("div"));
    act(() => root.render(<Probe threshold={threshold} callback={callback} />));
    unmounts.push(() => act(() => root.unmount()));
    return {
      rerender: (nextThreshold?: number, nextCallback?: Callback) =>
        act(() =>
          root.render(
            <Probe threshold={nextThreshold} callback={nextCallback} />,
          ),
        ),
    };
  };

  beforeEach(() => {
    results.length = 0;
    Object.defineProperty(window, "scrollY", { configurable: true, value: 0 });
  });

  afterEach(() => {
    for (const unmount of unmounts.splice(0)) unmount();
    if (originalScrollY)
      Object.defineProperty(window, "scrollY", originalScrollY);
  });

  it("returns false and never calls back without a threshold", () => {
    const callback = vi.fn<Callback>();
    render(undefined, callback);

    scrollTo(5000);

    expect(latest()).toBe(false);
    expect(callback).not.toHaveBeenCalled();
  });

  it("checks the current scroll position on mount", () => {
    const callback = vi.fn<Callback>();
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 300,
    });

    render(100, callback);

    expect(latest()).toBe(true);
    expect(callback).toHaveBeenCalledExactlyOnceWith(false, true);
  });

  it("reports whether the window scrolled below the threshold", () => {
    const callback = vi.fn<Callback>();
    render(100, callback);

    expect(latest()).toBe(false);
    expect(callback).toHaveBeenLastCalledWith(true, false);

    scrollTo(101);
    expect(latest()).toBe(true);
    expect(callback).toHaveBeenLastCalledWith(false, true);

    scrollTo(40);
    expect(latest()).toBe(false);
    expect(callback).toHaveBeenLastCalledWith(true, false);
  });

  it("works without a callback", () => {
    render(100);

    scrollTo(250);

    expect(latest()).toBe(true);
  });

  it("uses the new threshold when it changes", () => {
    const { rerender } = render(100);
    scrollTo(150);
    expect(latest()).toBe(true);

    rerender(200);

    expect(latest()).toBe(false);
  });

  it("stops listening to the scroll after unmount", () => {
    const callback = vi.fn();
    render(50, callback);
    scrollTo(100);
    expect(callback).toHaveBeenCalled();

    for (const unmount of unmounts.splice(0)) unmount();
    callback.mockClear();
    scrollTo(0);

    expect(callback).not.toHaveBeenCalled();
  });
});
