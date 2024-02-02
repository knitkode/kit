import { throttle } from "@koine/utils";
import { listenScroll } from "./listenScroll";

/**
 * Listen element's (`window` by default) _scroll_ event throttling the callback
 *
 * @returns An automatic unbinding function to run to deregister the listener upon call
 */
export let listenScrollThrottled = (
  el?: Parameters<typeof listenScroll>[1],
  ...args: Parameters<typeof throttle>
) => listenScroll(throttle(...args), el);
