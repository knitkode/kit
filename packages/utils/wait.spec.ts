import { wait } from "./wait";

describe("wait", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("resolves after the given milliseconds", async () => {
    const onResolve = vi.fn();
    wait(100).then(onResolve);

    await vi.advanceTimersByTimeAsync(99);
    expect(onResolve).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(1);
    expect(onResolve).toHaveBeenCalledTimes(1);
  });

  it("resolves with undefined", async () => {
    const promise = wait(10);
    vi.advanceTimersByTime(10);
    await expect(promise).resolves.toBeUndefined();
  });

  it("resolves on the next tick with 0 milliseconds", async () => {
    const onResolve = vi.fn();
    wait(0).then(onResolve);

    expect(onResolve).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(0);
    expect(onResolve).toHaveBeenCalledTimes(1);
  });
});
