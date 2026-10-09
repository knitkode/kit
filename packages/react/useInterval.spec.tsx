import { act } from "react";
import { createRoot } from "react-dom/client";
import { useInterval } from "./useInterval";

// tells React to run effects synchronously inside `act()`
(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

type Props = { callback: () => unknown; delay: number; deps?: unknown[] };

const Probe = ({ callback, delay, deps }: Props) => {
  useInterval(callback, delay, deps);
  return null;
};

describe("useInterval", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("calls the callback every `delay` milliseconds", () => {
    const callback = vi.fn();
    const root = createRoot(document.createElement("div"));

    act(() => root.render(<Probe callback={callback} delay={100} />));

    expect(callback).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(99));
    expect(callback).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(1));
    expect(callback).toHaveBeenCalledTimes(1);

    act(() => vi.advanceTimersByTime(250));
    expect(callback).toHaveBeenCalledTimes(3);

    act(() => root.unmount());
  });

  it("uses the latest callback without restarting the interval", () => {
    const first = vi.fn();
    const second = vi.fn();
    const root = createRoot(document.createElement("div"));

    act(() => root.render(<Probe callback={first} delay={100} />));
    act(() => vi.advanceTimersByTime(60));
    act(() => root.render(<Probe callback={second} delay={100} />));
    act(() => vi.advanceTimersByTime(40));

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);

    act(() => root.unmount());
  });

  it("restarts the interval when the delay changes", () => {
    const callback = vi.fn();
    const root = createRoot(document.createElement("div"));

    act(() => root.render(<Probe callback={callback} delay={100} />));
    act(() => vi.advanceTimersByTime(50));
    act(() => root.render(<Probe callback={callback} delay={300} />));
    act(() => vi.advanceTimersByTime(299));

    expect(callback).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(1));
    expect(callback).toHaveBeenCalledTimes(1);

    act(() => root.unmount());
  });

  it("clears the interval on unmount", () => {
    const callback = vi.fn();
    const root = createRoot(document.createElement("div"));

    act(() => root.render(<Probe callback={callback} delay={100} />));
    act(() => vi.advanceTimersByTime(100));
    act(() => root.unmount());
    act(() => vi.advanceTimersByTime(1000));

    expect(callback).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("does not schedule anything when the delay is null", () => {
    const callback = vi.fn();
    const root = createRoot(document.createElement("div"));

    act(() =>
      root.render(
        // @ts-expect-error `delay` is typed as `number` although `null` pauses the interval
        <Probe callback={callback} delay={null} />,
      ),
    );
    act(() => vi.advanceTimersByTime(1000));

    expect(callback).not.toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);

    act(() => root.unmount());
  });

  it("refreshes the callback when the extra deps change", () => {
    const calls: number[] = [];
    const root = createRoot(document.createElement("div"));
    // the same callback reference reads a value that changes with `deps`
    const state = { value: 1 };
    const callback = () => calls.push(state.value);

    act(() =>
      root.render(<Probe callback={callback} delay={100} deps={[1]} />),
    );
    act(() => vi.advanceTimersByTime(100));
    state.value = 2;
    act(() =>
      root.render(<Probe callback={callback} delay={100} deps={[2]} />),
    );
    act(() => vi.advanceTimersByTime(100));

    expect(calls).toEqual([1, 2]);

    act(() => root.unmount());
  });
});
