import type { AnythingFalsy } from "@koine/utils";

export type AnyDOMEventTarget = Window | Document | HTMLElement | Element;

/**
 * We use it either throwing an error on unexisting element or falling back
 * to `window` in case of _scroll_ or _resize_ events
 */
export type AnyDOMEventTargetLoose = AnyDOMEventTarget | AnythingFalsy;

export type AnyWindowEventType = keyof WindowEventMap;
export type AnyDocumentEventType = keyof DocumentEventMap;
export type AnyGlobalEventType = keyof GlobalEventHandlersEventMap;

export type AnyDOMEventType<
  TTarget extends AnyDOMEventTargetLoose = AnyDOMEventTargetLoose,
> = TTarget extends Window
  ? AnyWindowEventType
  : TTarget extends Document
    ? AnyDocumentEventType
    : AnyGlobalEventType;

export type AnyDOMEvent<
  TTarget extends AnyDOMEventTargetLoose,
  TType extends AnyWindowEventType | AnyDocumentEventType | AnyGlobalEventType,
> = TTarget extends Window
  ? TType extends keyof WindowEventMap
    ? WindowEventMap[TType]
    : Event
  : TTarget extends Document
    ? TType extends keyof DocumentEventMap
      ? DocumentEventMap[TType]
      : Event
  : TType extends keyof GlobalEventHandlersEventMap
    ? GlobalEventHandlersEventMap[TType]
    : Event;
