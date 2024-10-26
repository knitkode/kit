import { off } from "./off";
import { on } from "./on";
import type { AnyDOMEventTargetLoose, AnyDOMEventType } from "./types";

/**
 * One shot listener, it `addEventListener` and removes it first time is called
 * with `removeEventListener`
 */
export let once = (
  el: AnyDOMEventTargetLoose,
  type: AnyDOMEventType,
  handler: EventListener,
  options: EventListenerOptions | boolean = false,
) => {
  const handlerWrapper = (event: Event) => {
    handler(event);
    off(el, type, handlerWrapper);
  };

  // @ts-expect-error dom listener types
  return on(el, type, handlerWrapper, options);
};

export default once;
