import { useCallback } from "react";
import { getOffsetTopSlim, scrollTo } from "@knitkode/dom";
import { isNumber } from "@knitkode/utils";
import { useFixedOffset } from "./useFixedOffset";

/**
 * Smoothly scroll the window to a position or to an element, minus the height
 * of the fixed elements (see `useFixedOffset`) so that they do not cover it.
 *
 * The returned function accepts:
 * - `to`: the position (in px from the top of the page) or the `id` of the
 * element to scroll to
 * - `customOffset`: added to the destination (e.g. `-20` to stop 20px before)
 * - `callback`, `fallbackTimeout` and `behavior`: see `scrollTo` from
 * `@knitkode/dom`
 *
 * The destination is never above the top of the page.
 *
 * @param disregardAutomaticFixedOffset Do not subtract the _fixedOffset_ from
 * the `to` positions. When `to` is an element `id` we will keep into account
 * the _fixedOffset_ despite this option.
 */
export let useSmoothScroll = (disregardAutomaticFixedOffset?: boolean) => {
  const fixedOffset = useFixedOffset();

  const scroll = useCallback(
    (
      to?: number | string,
      customOffset?: number,
      callback?: () => void,
      fallbackTimeout?: number,
      behavior?: ScrollBehavior,
    ) => {
      let top: number | undefined = undefined;
      let toIsElement = false;

      if (isNumber(to)) {
        top = to;
      } else if (to) {
        const el = document.getElementById(to);
        if (el) {
          top = getOffsetTopSlim(el);
          toIsElement = true;
        }
      }

      if (isNumber(top)) {
        top =
          top +
          (customOffset || 0) -
          (disregardAutomaticFixedOffset && !toIsElement
            ? 0
            : fixedOffset.current);

        // the window cannot scroll above the top, `scrollTo` would otherwise
        // never call back
        scrollTo(Math.max(0, top), callback, fallbackTimeout, behavior);
      }
    },
    [disregardAutomaticFixedOffset, fixedOffset],
  );

  return scroll;
};

export default useSmoothScroll;
