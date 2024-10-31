import {
  type EventCallback,
  activeEvents,
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

    // If it's the last event of it's type, remove entirely
    if (events.length < 2 || !selector) {
      delete activeEvents[type];
      off(window, type, eventHandler, true);
      return;
    }

    // Otherwise, remove event
    // FIXME: remove assertion, fix type
    const index = getIndex(events, selector, callback as never);
    if (index < 0) return;

    activeEvents[type]!.splice(index, 1);
  });
};

export default unlisten;
