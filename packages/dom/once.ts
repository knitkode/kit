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
  // @ ts-ignore Type instantiation too deep // (event: AnyDOMEvent<TTarget, TType>) => {
  const handlerWrapper = (event: any) => {
    // @ ts-ignore Type instantiation too deep
    (handler as any)(event);
    off(el, type, handlerWrapper);
  };

  return on(el, type, handlerWrapper as any, options);
};

export default once;
