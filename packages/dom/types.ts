import type { AnythingFalsy, LiteralUnion } from "@koine/utils";

export type AnyDOMEventTarget = Window | Document | HTMLElement | Element;

/**
 * We use it either throwing an error on unexisting element or falling back
 * to `window` in case of _scroll_ or _resize_ events
 */
export type AnyDOMEventTargetLoose = AnyDOMEventTarget | AnythingFalsy;

type StandardDOMEventTypes = keyof GlobalEventHandlersEventMap;

export type AnyDOMEventType = LiteralUnion<
  StandardDOMEventTypes | "storage" | "popstate",
  string
>;

export type AnyDOMEvent<TType extends AnyDOMEventType> =
  TType extends StandardDOMEventTypes
    ? GlobalEventHandlersEventMap[TType]
    : TType extends "storage"
      ? StorageEvent
      : TType extends "popstate"
        ? PopStateEvent
        : Event;
