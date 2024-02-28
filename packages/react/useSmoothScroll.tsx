import { useCallback } from "react";
import { isNumber } from "@koine/utils";
import { getOffsetTopSlim, scrollTo } from "@koine/dom";
import { useFixedOffset } from "./useFixedOffset";

/**
 *
 * @param disregardAutomaticFixedOffset When the `to` scroll argument is a DOM
 * selector we will keep into account the _fixedOffset_ despite this option.
 * @returns
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
          top = getOffsetTopSlim(el) - fixedOffset.current;
          toIsElement = true;
        }
      }

      if (isNumber(top)) {
        top =
          top +
          (customOffset || 0) +
          (disregardAutomaticFixedOffset || toIsElement
            ? 0
            : fixedOffset.current);

        scrollTo(top, callback, fallbackTimeout, behavior);
      }
    },
    [disregardAutomaticFixedOffset, fixedOffset],
  );

  return scroll;
};

export default useSmoothScroll;
