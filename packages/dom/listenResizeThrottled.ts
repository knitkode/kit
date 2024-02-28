import { throttle } from "@koine/utils";
import { listenResize } from "./listenResize";

/**
 * Listen element's (`window` by default) _resize_ event throttling the callback
 *
 * @returns An automatic unbinding function to run to deregister the listener upon call
 */
export let listenResizeThrottled = (
  el?: Parameters<typeof listenResize>[1],
  ...args: Parameters<typeof throttle>
) => listenResize(throttle(...args), el);

export default listenResizeThrottled;
