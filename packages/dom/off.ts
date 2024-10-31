import type {
  AnyDOMEvent,
  AnyDOMEventTargetLoose,
  AnyDOMEventType,
} from "./types";

/**
 * Shortcut for `removeEventListener`
 */
export let off = <
  TTarget extends AnyDOMEventTargetLoose,
  TType extends AnyDOMEventType<TTarget> = AnyDOMEventType<TTarget>
>(
  el: TTarget,
  type: TType,
  handler: (event: AnyDOMEvent<TTarget, TType>) => void,
  options: EventListenerOptions | boolean = false,
) => {
  if (process.env["NODE_ENV"] === "development") {
    if (!el) {
      console.warn("[@koine/dom:off] unexisting DOM element");
    }
  }
  if (el) el.removeEventListener(type, handler as any, options);
};

export default off;
