import type { AnythingFalsy, LiteralUnion } from "@koine/utils";

export type AnyDOMEventTarget = Window | Document | HTMLElement | Element;

/**
 * We use it either throwing an error on unexisting element or falling back
 * to `window` in case of _scroll_ or _resize_ events
 */
export type AnyDOMEventTargetLoose = AnyDOMEventTarget | AnythingFalsy;

export type AnyWindowEventType = keyof WindowEventMap;
export type AnyGlobalEventType = keyof GlobalEventHandlersEventMap;

export type AnyDOMEventType<
  TTarget extends AnyDOMEventTargetLoose = AnyDOMEventTargetLoose,
> = TTarget extends Window ? AnyWindowEventType : AnyGlobalEventType;

export type AnyDOMEvent<
  TTarget extends AnyDOMEventTargetLoose,
  TType extends AnyWindowEventType | AnyGlobalEventType,
> = TTarget extends Window
  ? TType extends keyof WindowEventMap
    ? WindowEventMap[TType]
    : Event
  : TType extends keyof GlobalEventHandlersEventMap
    ? GlobalEventHandlersEventMap[TType]
    : Event;
