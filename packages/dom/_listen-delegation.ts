/**
 * Listen: events delegation system
 *
 * From:
 * https://github.com/cferdinandi/events
 * https://github.com/cferdinandi/events/blob/master/src/js/events/events.js
 *
 * @fileoverview
 */
import { isString } from "@knitkode/utils";
import { escapeSelector } from "./escapeSelector";
import type {
  AnyDOMEvent,
  AnyDOMEventTarget,
  AnyWindowEventType,
} from "./types";

/**
 * Callback signature accepted by `listen`, `listenOnce` and `unlisten`.
 */
export type EventCallback<
  TTarget extends AnyDOMEventTarget = AnyDOMEventTarget,
> = (event: AnyDOMEvent<TTarget, any>, desiredTarget: TTarget) => any;

/**
 * A registered listener, as returned by `getListeners`.
 */
export type ListenEvent = {
  selector: string;
  callback: EventCallback;
};

/**
 * Active events
 *
 * @internal
 */
export let activeEvents: Partial<Record<AnyWindowEventType, ListenEvent[]>> =
  {};

/**
 * Get the index for the listener, matching the callback by reference or, for
 * `listenOnce` wrappers, by the original callback they hold in `o`
 *
 * @internal
 */
export let getIndex = (
  arr: ListenEvent[],
  selector: string,
  callback: EventCallback,
) =>
  arr.findIndex(
    ({ selector: s, callback: c }) =>
      s === selector &&
      (c === callback || (callback && (c as any).o === callback)),
  );

/**
 * Check if the listener callback should run or not
 *
 * @internal
 * @param target The event.target
 * @param selector The selector/element to check the target against
 * @return If not false, run listener and pass the targeted element to use in the callback
 */
export let getRunTarget = (
  target: HTMLElement,
  selector: string | (Window & typeof globalThis) | Document | Element,
): AnyDOMEventTarget | null | undefined | false => {
  // @ts-expect-error FIXME: type
  if (["*", "window", window].includes(selector)) {
    return window;
  }
  if (
    [
      "document",
      "document.documentElement",
      document,
      document.documentElement,
      // @ts-expect-error FIXME: type
    ].includes(selector)
  )
    return document;

  // the target can be the `window` or the `document`, which never match
  if (isString(selector)) {
    return target.closest?.<HTMLElement>(escapeSelector(selector));
  }

  // @ts-expect-error FIXME: type
  if (typeof selector !== "string" && selector.contains) {
    if (selector === target) {
      return target;
    }
    // @ts-expect-error FIXME: type
    if (target.nodeType && selector.contains(target)) {
      return selector as HTMLElement;
    }
    return false;
  }

  return false;
};

/**
 * Handle listeners after event fires
 *
 * @internal
 */
export let eventHandler = <T extends Event>(event: T) => {
  const type = event.type as keyof typeof activeEvents;
  // loop over a copy as listeners can unlisten while running (`listenOnce`
  // does), but like the DOM skip the ones removed before their turn
  activeEvents[type]?.slice().forEach((listener) => {
    const target =
      activeEvents[type]?.includes(listener) &&
      getRunTarget(event.target as HTMLElement, listener.selector);
    if (target) listener.callback(event, target);
  });
};
