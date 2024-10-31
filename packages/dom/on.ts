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
// export function on<
//   TTarget extends AnyDOMEventTargetLoose,
//   TType extends string,
// >(
//   el: TTarget,
//   type: TType,
//   handler: (event: Event) => void,
//   options?: AddEventListenerOptions | boolean,
// ): void;
// export function on<
//   TTarget extends AnyDOMEventTargetLoose,
//   TType extends AnyDOMEventType<TTarget> = AnyDOMEventType<TTarget>,
// >(
//   el: TTarget,
//   type: TType,
//   handler: (/* this: TTarget,  */event: AnyDOMEvent<TTarget, TType>) => void,
//   options?: AddEventListenerOptions | boolean,
// ): void;
export function on<
  TTarget extends AnyDOMEventTargetLoose,
  TType extends AnyDOMEventType<TTarget> = AnyDOMEventType<TTarget>,
>(
  el: TTarget,
  type: TType,
  handler: (/* this: TTarget,  */ event: AnyDOMEvent<TTarget, TType>) => void,
  options: AddEventListenerOptions | boolean = false,
) {
  if (process.env["NODE_ENV"] === "development") {
    if (!el) {
      console.warn("[@koine/dom:on] unexisting DOM element");
    }
  }
  if (el) {
    el.addEventListener(type, handler as never, options);
    // @ ts-expect-error Type instantiation too deep
    return () => off(el as never, type as never, handler as never);
  }

  return noop;
}

export default on;

// // @ts-expect-error
// on(document.createElement("iframe"), "waitingforkey", (e) => e.preventDefault());
// // @ts-expect-error
// on(document.createElement("audio"), "DOMContentLoaded", (e) => e.preventDefault());
// // @ts-expect-error
// on(window, "waitingforkey", (e) => e.preventDefault());
// // @ts-expect-error
// on(document, "waitingforkey", (e) => e.preventDefault());

// on(document.createElement("audio"), "waitingforkey", (e) => e.preventDefault());
// on(window, "click", (e) => e.preventDefault());
// on(document, "click", (e) => e.preventDefault());
