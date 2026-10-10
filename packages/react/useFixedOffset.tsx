import { useRef } from "react";
import {
  calculateFixedOffset,
  domEach,
  injectCss,
  listenResizeDebounced,
} from "@knitkode/dom";
import { debounce } from "@knitkode/utils";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";

const inject = (value: number) => {
  injectCss("useFixedOffset", `html{scroll-padding-top: ${value}px}`);
};

/**
 * # Use fixed offset
 *
 * Maybe use [ResizeObserver polyfill](https://github.com/juggle/resize-observer)
 *
 * @see https://web.dev/resize-observer/
 *
 * @param selector By default `[data-fixed]`: anyhting with the data attribute `data-fixed`
 */
export let useFixedOffset = (selector?: string) => {
  const fixedOffset = useRef<number>(0);

  useIsomorphicLayoutEffect(() => {
    const fixedSelector = selector || "[data-fixed]";
    // sum the height of all the fixed elements, not only of the resized ones
    const calculate = () =>
      (fixedOffset.current = calculateFixedOffset(fixedSelector));
    // inject this CSS make the hashed deeplinks position the scroll at the
    // right offset
    const update = () => inject(calculate());

    update();

    if (typeof ResizeObserver !== "undefined") {
      // update the offset right away, debounce only the CSS injection
      const injectDebounced = debounce(inject, 400);
      const observer = new ResizeObserver(() => injectDebounced(calculate()));

      domEach(fixedSelector, ($el) => observer.observe($el));

      return () => observer.disconnect();
    }
    return listenResizeDebounced(0, update);
  }, [selector]);

  return fixedOffset;
};

export default useFixedOffset;
