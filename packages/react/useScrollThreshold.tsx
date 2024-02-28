import { useCallback, useEffect, useState } from "react";
import { noop } from "@koine/utils";
import { listenScroll } from "@koine/dom";

export let useScrollThreshold = (
  threshold?: number,
  callback?: (isAbove: boolean, isBelow: boolean) => void,
) => {
  const [isBelow, setIsBelow] = useState(false);

  const handler = useCallback(() => {
    if (threshold) {
      const posY = window.scrollY; // * -1;
      const isAbove = posY < threshold;
      const isBelow = posY > threshold;

      // console.log("useScrollThreshold setIsBelow", isBelow, posY, threshold);
      setIsBelow(isBelow);

      if (callback) callback(isAbove, isBelow);
    }
  }, [threshold, callback]);

  useEffect(() => {
    if (threshold) {
      // const listener = listenScrollThrottled(0, handler, 50);
      const listener = listenScroll(handler);

      handler();

      return listener;
    }

    return noop;
  }, [threshold, handler]);

  return isBelow;
};

export default useScrollThreshold;
