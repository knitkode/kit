import { off } from "./off";
import { on } from "./on";
import type { AnyDOMEventTargetLoose } from "./types";

/**
 * One shot listener, it `addEventListener` and removes it first time is called
 * with `removeEventListener`
 */
export let once = (
  el: AnyDOMEventTargetLoose,
  type: string,
  handler: EventListener,
  options: EventListenerOptions | boolean = false,
) => {
  const handlerWrapper = (event: Event) => {
    handler(event);
    off(el, type, handlerWrapper);
  };

  return on(el, type, handlerWrapper, options);
};
