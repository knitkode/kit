import { act, type DependencyList } from "react";
import { createRoot } from "react-dom/client";
import {
  type UseAsyncFnReturn,
  type UseAsyncState,
  useAsyncFn,
} from "./useAsyncFn";

// tells React to run effects synchronously inside `act()`
(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const createDeferred = <T,>() => {
  let resolve: (value: T) => void = () => {};
  let reject: (reason: unknown) => void = () => {};
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

type Fn = (id: number) => Promise<string>;

const unmounts: Array<() => void> = [];

function renderUseAsyncFn(
  fn: Fn,
  deps?: DependencyList,
  initialState?: UseAsyncState<string>,
) {
  const result = { current: undefined as UseAsyncFnReturn<Fn> | undefined };
  const root = createRoot(document.createElement("div"));
  const Probe = (props: { fn: Fn; deps?: DependencyList }) => {
    result.current = useAsyncFn(props.fn, props.deps, initialState);
    return null;
  };
  act(() => root.render(<Probe fn={fn} deps={deps} />));
  let mounted = true;
  const unmount = () => {
    if (mounted) act(() => root.unmount());
    mounted = false;
  };
  unmounts.push(unmount);
  const get = () => {
    if (!result.current) throw new Error("hook did not render");
    return result.current;
  };
  return {
    state: () => get()[0],
    callback: () => get()[1],
    rerender: (nextFn: Fn, nextDeps?: DependencyList) =>
      act(() => root.render(<Probe fn={nextFn} deps={nextDeps} />)),
    unmount,
  };
}

afterEach(() => {
  for (const unmount of unmounts.splice(0)) unmount();
});

describe("useAsyncFn", () => {
  it("starts with a not loading state by default", () => {
    const { state } = renderUseAsyncFn(async () => "value");

    expect(state()).toEqual({ loading: false });
  });

  it("starts with the given initial state", () => {
    const { state } = renderUseAsyncFn(async () => "value", [], {
      loading: true,
    });

    expect(state()).toEqual({ loading: true });
  });

  it("does not call the function until the callback is invoked", () => {
    const fn = vi.fn(async (id: number) => `value-${id}`);

    renderUseAsyncFn(fn);

    expect(fn).not.toHaveBeenCalled();
  });

  it("sets loading while pending and the value once resolved", async () => {
    const deferred = createDeferred<string>();
    const fn = vi.fn((_id: number) => deferred.promise);
    const { state, callback } = renderUseAsyncFn(fn);

    let returned: Promise<string> | undefined;
    act(() => {
      returned = callback()(7);
    });

    expect(fn).toHaveBeenCalledWith(7);
    expect(state()).toEqual({ loading: true });

    await act(async () => {
      deferred.resolve("done");
      await deferred.promise;
    });

    expect(state()).toEqual({ loading: false, value: "done" });
    await expect(returned).resolves.toBe("done");
  });

  it("sets the error once rejected", async () => {
    const deferred = createDeferred<string>();
    const error = new Error("failed");
    const { state, callback } = renderUseAsyncFn(() => deferred.promise);

    act(() => {
      callback()(1);
    });
    await act(async () => {
      deferred.reject(error);
      await deferred.promise.catch(() => {});
    });

    expect(state()).toEqual({ loading: false, error });
  });

  it("keeps the previous value while loading again", async () => {
    let deferred = createDeferred<string>();
    const { state, callback } = renderUseAsyncFn(() => deferred.promise);

    act(() => {
      callback()(1);
    });
    await act(async () => {
      deferred.resolve("first");
      await deferred.promise;
    });

    deferred = createDeferred<string>();
    act(() => {
      callback()(2);
    });

    expect(state()).toEqual({ loading: true, value: "first" });
  });

  it("only applies the result of the latest call", async () => {
    const first = createDeferred<string>();
    const second = createDeferred<string>();
    const fn = vi
      .fn<Fn>()
      .mockReturnValueOnce(first.promise)
      .mockReturnValueOnce(second.promise);
    const { state, callback } = renderUseAsyncFn(fn);

    act(() => {
      callback()(1);
      callback()(2);
    });
    await act(async () => {
      second.resolve("second");
      await second.promise;
    });

    expect(state()).toEqual({ loading: false, value: "second" });

    await act(async () => {
      first.resolve("first");
      await first.promise;
    });

    expect(state()).toEqual({ loading: false, value: "second" });
  });

  it("does not update the state after unmount", async () => {
    const deferred = createDeferred<string>();
    const consoleError = vi.spyOn(console, "error");
    const { state, callback, unmount } = renderUseAsyncFn(
      () => deferred.promise,
    );

    act(() => {
      callback()(1);
    });
    const lastState = state();
    unmount();

    await act(async () => {
      deferred.resolve("late");
      await deferred.promise;
    });

    expect(state()).toBe(lastState);
    expect(consoleError).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it("memoizes the callback according to the deps", () => {
    const fn: Fn = async (id) => `${id}`;
    const { callback, rerender } = renderUseAsyncFn(fn, ["a"]);
    const initial = callback();

    rerender(fn, ["a"]);
    expect(callback()).toBe(initial);

    rerender(fn, ["b"]);
    expect(callback()).not.toBe(initial);
  });

  it("calls the function captured with the current deps", async () => {
    const first = vi.fn(async (_id: number) => "first");
    const second = vi.fn(async (_id: number) => "second");
    const { state, callback, rerender } = renderUseAsyncFn(first, [1]);

    rerender(second, [1]);
    await act(async () => {
      await callback()(1);
    });
    expect(first).toHaveBeenCalledTimes(1);
    expect(second).not.toHaveBeenCalled();

    rerender(second, [2]);
    await act(async () => {
      await callback()(1);
    });
    expect(second).toHaveBeenCalledTimes(1);
    expect(state()).toEqual({ loading: false, value: "second" });
  });
});
