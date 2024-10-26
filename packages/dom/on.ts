import { noop } from "@koine/utils";
import { off } from "./off";
import type {
  AnyWindowEventType,
  AnyDocumentEventType,
  AnyGlobalEventType,
  AnyDOMEvent,
  AnyDOMEventTargetLoose,
} from "./types";

/**
 * Shortcut for `addEventListener`
 *
 * @returns An automatic unbinding function to run to deregister the listener upon call
 */
export function on<
  TTarget extends HTMLElement | Element, // Exclude<AnyDOMEventTargetLoose, Window | Document>,
  TType extends AnyGlobalEventType
>(
  el: TTarget,
  type: TType,
  handler: (event: AnyDOMEvent<TTarget, TType>) => void,
  options?: AddEventListenerOptions | boolean,
): void;
export function on<
  TTarget extends Document, // Exclude<AnyDOMEventTargetLoose, Window | HTMLElement | Element>,
  TType extends AnyDocumentEventType
>(
  el: TTarget,
  type: TType,
  handler: (event: AnyDOMEvent<TTarget, TType>) => void,
  options?: AddEventListenerOptions | boolean,
): void;
export function on<
  TTarget extends Window, // Exclude<AnyDOMEventTargetLoose, Document | HTMLElement | Element>,
  TType extends AnyWindowEventType
>(
  el: TTarget,
  type: TType,
  handler: (event: AnyDOMEvent<TTarget, TType>) => void,
  options?: AddEventListenerOptions | boolean,
): void;
export function on<
  TTarget extends AnyDOMEventTargetLoose,
  TType extends AnyGlobalEventType | AnyDocumentEventType | AnyWindowEventType,
  // TType extends TTarget extends { addEventListener: (...args: infer T) => void } ? T[0] : ""
>(
  el: TTarget,
  type: TType,
  handler: (event: AnyDOMEvent<TTarget, TType>) => void,
  // handler: THandler /* EventListener |  */ /* ((event: Event) => void) */,
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
