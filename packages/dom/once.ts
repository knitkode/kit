import { off } from "./off";
import { on } from "./on";
import type {
  AnyDOMEvent,
  AnyDOMEventTargetLoose,
  AnyDOMEventType,
} from "./types";

/**
 * One shot listener, it `addEventListener` and removes it first time is called
 * with `removeEventListener`
 */
export let once = <
  TTarget extends AnyDOMEventTargetLoose,
  TType extends AnyDOMEventType<TTarget> = AnyDOMEventType<TTarget>,
>(
  el: TTarget,
  type: TType,
  handler: (event: AnyDOMEvent<TTarget, TType>) => void,
  options: EventListenerOptions | boolean = false,
) => {
  const handlerWrapper = (event: AnyDOMEvent<TTarget, TType>) => {
    // @ ts-expect-error Type instantiation too deep
    handler(event);
    off(el, type, handlerWrapper);
  };

  return on(el, type, handlerWrapper as any, options);
};

export default once;
