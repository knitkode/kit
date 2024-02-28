import { debounce } from "@koine/utils";
import { listenScroll } from "./listenScroll";

/**
 * Listen element's (`window` by default) _scroll_ event debouncing the callback
 *
 * @returns An automatic unbinding function to run to deregister the listener upon call
 */
export let listenScrollDebounced = (
  el?: Parameters<typeof listenScroll>[1],
  ...args: Parameters<typeof debounce>
) => listenScroll(debounce(...args), el);

export default listenScrollDebounced;
