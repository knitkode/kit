import React, { useCallback, useRef, useState } from "react";
import { useMountedState } from "./useMountedState";

type PromiseType<P extends Promise<any>> =
  P extends Promise<infer T> ? T : never;

type FunctionReturningPromise = (...args: any[]) => Promise<any>;

export type UseAsyncState<T> =
  | {
      loading: boolean;
      error?: undefined;
      value?: undefined;
    }
  | {
      loading: true;
      error?: Error | undefined;
      value?: T;
    }
  | {
      loading: false;
      error: Error;
      value?: undefined;
    }
  | {
      loading: false;
      error?: undefined;
      value: T;
    };

type StateFromFunctionReturningPromise<T extends FunctionReturningPromise> =
  UseAsyncState<PromiseType<ReturnType<T>>>;

export type UseAsyncFnReturn<
  T extends FunctionReturningPromise = FunctionReturningPromise,
> = [StateFromFunctionReturningPromise<T>, T];

/**
 * @borrows [streamich/react-use](https://github.com/streamich/react-use/blob/master/src/useAsyncFn.ts)
 */
export let useAsyncFn = <T extends FunctionReturningPromise>(
  fn: T,
  deps: React.DependencyList = [],
  initialState: StateFromFunctionReturningPromise<T> = { loading: false },
): UseAsyncFnReturn<T> => {
  const lastCallId = useRef(0);
  const isMounted = useMountedState();
  const [state, set] =
    useState<StateFromFunctionReturningPromise<T>>(initialState);

  const callback = useCallback((...args: Parameters<T>): ReturnType<T> => {
    const callId = ++lastCallId.current;

    if (!state.loading) {
      set((prevState) => ({ ...prevState, loading: true }));
    }

    return fn(...args).then(
      (value) => {
        isMounted() &&
          callId === lastCallId.current &&
          set({ value, loading: false });

        return value;
      },
      (error) => {
        isMounted() &&
          callId === lastCallId.current &&
          set({ error, loading: false });

        return error;
      },
    ) as ReturnType<T>;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return [state, callback as unknown as T];
};

export default useAsyncFn;
