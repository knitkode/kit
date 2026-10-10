import {
  activeEvents,
  type EventCallback,
  eventHandler,
  getIndex,
} from "./_listen-delegation";
import { off } from "./off";
import type { AnyDOMEventTarget, AnyWindowEventType } from "./types";

type CommaSeparatedListOf<T extends string> =
  | `${T}`
  | `${T},${T}` extends infer O
  ? O
  : never;
// | `${T},${T},${T}`
// | `${T},${T},${T},${T}`
// | `${T},${T},${T},${T},${T}`
// | `${T},${T},${T},${T},${T},${T}`

/**
 * Stop listening for an event
 *
 * @category listen-delegation
 *
 * @param types The event type or types (comma separated)
 * @param selector The selector to remove the event from
 * @param callback The function to remove
 */
export let unlisten = <
  TTypes extends CommaSeparatedListOf<AnyWindowEventType>,
  TTarget extends AnyDOMEventTarget = AnyDOMEventTarget,
>(
  types: TTypes,
  selector: string,
  callback: EventCallback<TTarget>,
) => {
  // Loop through each event type
  types.split(",").forEach((_type) => {
    // Remove whitespace
    const type = _type.trim() as AnyWindowEventType;
    const events = activeEvents[type];

    // if event type doesn't exist, bail
    if (!events) return;

    // Without a selector remove all the listeners, otherwise the matching one
    if (!selector) events.length = 0;
    else {
      // FIXME: remove assertion, fix type
      const index = getIndex(events, selector, callback as never);
      if (index > -1) events.splice(index, 1);
    }

    // If no listener of this type is left, remove the type entirely
    if (!events.length) {
      delete activeEvents[type];
      off(window, type, eventHandler, true);
    }
  });
};

export default unlisten;
