import { useRef } from "react";
import { isBrowser } from "@koine/utils";
import { listenScroll } from "@koine/dom";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";

type Position = {
  x: number;
  y: number;
};

type ElementRef = React.MutableRefObject<HTMLElement | undefined>;

const zeroPosition = { x: 0, y: 0 };

const getClientRect = (element?: HTMLElement) =>
  element?.getBoundingClientRect();

const getScrollPosition = (
  element?: null | ElementRef,
  boundingElement?: ElementRef,
) => {
  if (!isBrowser) {
    return zeroPosition;
  }

  if (!boundingElement) {
    return { x: window.scrollX, y: window.scrollY };
  }

  const targetPosition = getClientRect(element?.current || document.body);
  const containerPosition = getClientRect(boundingElement.current);

  if (!targetPosition) {
    return zeroPosition;
  }

  return containerPosition
    ? {
        x: (containerPosition.x || 0) - (targetPosition.x || 0),
        y: (containerPosition.y || 0) - (targetPosition.y || 0),
      }
    : { x: targetPosition.left, y: targetPosition.top };
};

/**
 * @borrows [@n8tb1t/use-scroll-position@2.0.3](https://github.com/n8tb1t/use-scroll-position) by `n8tb1t <n8tb1t@gmail.com>`
 *
 * We've just:
 * - reused internal helper functions
 * - compacted object arguments in functions as plain argument list to improve compression
 */
export let useScrollPosition = (
  effect: (currentPosition: Position, prevPosition: Position) => void,
  deps: React.DependencyList = [],
  element?: ElementRef,
  boundingElement?: ElementRef,
  wait?: number,
): void => {
  const position = useRef(getScrollPosition(null, boundingElement));

  let throttleTimeout: number | null = null;

  const callBack = () => {
    const current = getScrollPosition(element, boundingElement);
    effect(current, position.current);
    position.current = current;
    throttleTimeout = null;
  };

  useIsomorphicLayoutEffect(() => {
    if (!isBrowser) {
      return undefined;
    }

    const handleScroll = () => {
      if (wait) {
        if (throttleTimeout === null) {
          throttleTimeout = window.setTimeout(callBack, wait);
        }
      } else {
        callBack();
      }
    };

    const listener = listenScroll(handleScroll, boundingElement?.current);

    return () => {
      listener();

      if (throttleTimeout) {
        clearTimeout(throttleTimeout);
      }
    };
  }, deps);
};

export default useScrollPosition;
