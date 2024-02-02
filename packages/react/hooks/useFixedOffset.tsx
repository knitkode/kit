import { useRef } from "react";
import { debounce } from "@koine/utils";
import {
  $each,
  calculateFixedOffset,
  injectCss,
  listenResizeDebounced,
} from "@koine/dom";
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
    const update = () => {
      const newFixedOffset = calculateFixedOffset();
      fixedOffset.current = newFixedOffset;
      // inject this CSS make the hashed deeplinks position the scroll at the
      // right offset
      inject(newFixedOffset);
    };

    update();

    if (ResizeObserver) {
      // const elements = $all("[data-fixed]");

      const observer = new ResizeObserver((entries) => {
        let newFixedOffset = 0;

        entries.forEach((entry) => {
          newFixedOffset += entry.contentRect.height;
        });
        fixedOffset.current = newFixedOffset;
        const updateOnResize = debounce(
          () => inject(newFixedOffset),
          400,
          true,
        );
        updateOnResize();
      });

      $each(selector || "[data-fixed]", ($el) => {
        if (observer) observer.observe($el);
      });

      return () => {
        observer?.disconnect();
      };
    } else {
      const listener = listenResizeDebounced(0, update);
      return listener;
    }
  }, [selector]);

  return fixedOffset;
};
