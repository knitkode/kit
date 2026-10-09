import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { useSpinDelay } from "./useSpinDelay";

// tells React to run effects synchronously inside `act()`
(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

type Props = { loading: boolean; delay?: number; minDuration?: number };

const results: boolean[] = [];

const Probe = ({ loading, delay, minDuration }: Props) => {
  results.push(useSpinDelay(loading, delay, minDuration));
  return null;
};

const latest = () => results[results.length - 1];

describe("useSpinDelay", () => {
  let root: Root;

  const render = (props: Props) => act(() => root.render(<Probe {...props} />));
  const advance = (ms: number) => act(() => vi.advanceTimersByTime(ms));

  beforeEach(() => {
    vi.useFakeTimers();
    results.length = 0;
    root = createRoot(document.createElement("div"));
  });

  afterEach(() => {
    act(() => root.unmount());
    vi.useRealTimers();
  });

  it("returns false while not loading", () => {
    render({ loading: false });
    advance(1000);

    expect(latest()).toBe(false);
  });

  it("does not show the spinner before the default 500ms delay", () => {
    render({ loading: false });
    render({ loading: true });

    advance(499);
    expect(latest()).toBe(false);

    advance(1);
    expect(latest()).toBe(true);
  });

  it("never shows the spinner when loading ends before the delay", () => {
    render({ loading: true });
    advance(300);
    render({ loading: false });
    advance(1000);

    expect(results).not.toContain(true);
  });

  it("keeps showing the spinner for the default 200ms minimum duration", () => {
    render({ loading: true });
    advance(500);
    expect(latest()).toBe(true);

    // loading ends right after the spinner appeared
    advance(50);
    render({ loading: false });
    expect(latest()).toBe(true);

    advance(149);
    expect(latest()).toBe(true);

    advance(1);
    expect(latest()).toBe(false);
  });

  it("keeps showing the spinner while still loading after the minimum duration", () => {
    render({ loading: true });
    advance(500 + 200 + 1000);
    expect(latest()).toBe(true);

    render({ loading: false });
    expect(latest()).toBe(false);
  });

  it("supports custom delay and minimum duration", () => {
    render({ loading: true, delay: 100, minDuration: 1000 });

    advance(99);
    expect(latest()).toBe(false);

    advance(1);
    expect(latest()).toBe(true);

    render({ loading: false, delay: 100, minDuration: 1000 });
    advance(999);
    expect(latest()).toBe(true);

    advance(1);
    expect(latest()).toBe(false);
  });

  it("shows the spinner again for a new loading phase", () => {
    render({ loading: true });
    advance(800);
    render({ loading: false });
    expect(latest()).toBe(false);

    render({ loading: true });
    advance(499);
    expect(latest()).toBe(false);

    advance(1);
    expect(latest()).toBe(true);
  });

  it("clears the pending timeout on unmount", () => {
    render({ loading: true });
    advance(100);
    expect(vi.getTimerCount()).toBe(1);

    act(() => root.unmount());

    expect(vi.getTimerCount()).toBe(0);
    // let `afterEach` unmount a fresh root
    root = createRoot(document.createElement("div"));
  });
});
