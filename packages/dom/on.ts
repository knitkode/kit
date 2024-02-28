import { noop } from "@koine/utils";
import { off } from "./off";
import type {
  AnyDOMEvent,
  AnyDOMEventTargetLoose,
  AnyDOMEventType,
} from "./types";

/**
 * Shortcut for `addEventListener`
 *
 * @returns An automatic unbinding function to run to deregister the listener upon call
 */
export let on = <TType extends AnyDOMEventType>(
  el: AnyDOMEventTargetLoose,
  type: TType,
  handler: (event: AnyDOMEvent<TType>) => void,
  // handler: THandler /* EventListener |  */ /* ((event: Event) => void) */,
  options: AddEventListenerOptions | boolean = false,
) => {
  if (process.env["NODE_ENV"] === "development") {
    if (!el) {
      console.warn("[@koine/dom:on] unexisting DOM element");
    }
  }
  if (el) {
    el.addEventListener(type, handler as EventListener, options);
    return () => off(el, type, handler);
  }

  return noop;
};

export default on;
