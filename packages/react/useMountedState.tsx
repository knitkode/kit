import { useCallback, useEffect, useRef } from "react";

/**
 * @borrows [streamich/react-use](https://github.com/streamich/react-use/blob/master/src/useMountedState.ts)
 */
export let useMountedState = (): (() => boolean) => {
  const mountedRef = useRef<boolean>(false);
  const get = useCallback(() => mountedRef.current, []);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  return get;
};

export default useMountedState;
