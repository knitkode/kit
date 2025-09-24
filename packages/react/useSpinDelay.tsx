import { useEffect, useRef, useState } from "react";

const enum State {
  IDLE,
  DELAY,
  DISPLAY,
  EXPIRE,
}

/**
 * Wraps your booleans only returning true after the `delay`, and for a minimum
 * time of `minDuration`. This way you're sure that you don't show unnecessary
 * or very short living spinners.
 *
 * @borrows [smeijer/spin-delay](https://github.com/smeijer/spin-delay)
 *
 * - Smaller footprint and options object as argument
 *
 * @param delay [500]
 * @param minDuration [200]
 */
export let useSpinDelay = (
  loading: boolean,
  delay = 500,
  minDuration = 200,
) => {
  const [state, setState] = useState<State>(State.IDLE);
  const timeout = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    if (loading && state === State.IDLE) {
      clearTimeout(timeout.current);

      timeout.current = setTimeout(() => {
        if (!loading) {
          return setState(State.IDLE);
        }

        timeout.current = setTimeout(() => {
          setState(State.EXPIRE);
        }, minDuration);

        setState(State.DISPLAY);
      }, delay);

      setState(State.DELAY);
    }

    if (!loading && state !== State.DISPLAY) {
      clearTimeout(timeout.current);
      setState(State.IDLE);
    }
  }, [loading, state, delay, minDuration]);

  useEffect(() => {
    return () => clearTimeout(timeout.current);
  }, []);

  return state === State.DISPLAY || state === State.EXPIRE;
};

export default useSpinDelay;
