import { noop } from "@koine/utils";
import { off } from "./off";
import type {
  AnyWindowEventType,
  AnyDocumentEventType,
  AnyGlobalEventType,
  AnyDOMEvent,
  AnyDOMEventTargetLoose,
  AnyDOMEventType,
} from "./types";

/**
 * Shortcut for `addEventListener`
 *
 * @returns An automatic unbinding function to run to deregister the listener upon call
 */
export function on<
  Target extends Exclude<AnyDOMEventTargetLoose, Window | Document>,
  Type extends AnyGlobalEventType
>(
  el: Target,
  type: Type,
  handler: (event: AnyDOMEvent<Target, Type>) => void,
  options?: AddEventListenerOptions | boolean,
): () => void;
export function on<
  Target extends Exclude<AnyDOMEventTargetLoose, Window | HTMLElement | Element>,
  Type extends AnyDocumentEventType
>(
  el: Target,
  type: Type,
  handler: (event: AnyDOMEvent<Target, Type>) => void,
  options?: AddEventListenerOptions | boolean,
): () => void;
export function on<
  Target extends Exclude<AnyDOMEventTargetLoose, Document | HTMLElement | Element>,
  Type extends AnyWindowEventType
>(
  el: Target,
  type: Type,
  handler: (event: AnyDOMEvent<Target, Type>) => void,
  options?: AddEventListenerOptions | boolean,
): () => void;
export function on<
  Target extends AnyDOMEventTargetLoose,
  Type extends AnyDOMEventType<AnyDOMEventTargetLoose>
>(
  el: Target,
  type: Type,
  handler: (event: AnyDOMEvent<Target, Type>) => void,
  options?: AddEventListenerOptions | boolean,
): () => void;
export function on<
  Target extends AnyDOMEventTargetLoose,
  Type extends AnyDOMEventType<AnyDOMEventTargetLoose>
>(
  el: Target,
  type: Type,
  handler: (event: AnyDOMEvent<Target, Type>) => void,
  options: AddEventListenerOptions | boolean = false,
) {
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
