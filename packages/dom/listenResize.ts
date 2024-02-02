import { on } from "./on";
import type { AnyDOMEventTargetLoose } from "./types";

/**
 * Listen element's (`window` by default) _scroll_ event
 *
 * @returns An automatic unbinding function to run to deregister the listener upon call
 */
export let listenResize = (handler: () => void, el?: AnyDOMEventTargetLoose) =>
  on(el || window, "resize", handler);
