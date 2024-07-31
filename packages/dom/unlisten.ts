import {
  type EventCallback,
  activeEvents,
  eventHandler,
  getIndex,
} from "./_listen-delegation";
import { off } from "./off";
import type { AnyDOMEventTarget, AnyDOMEventType } from "./types";

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
  TTypes extends AnyDOMEventType,
  TTarget extends AnyDOMEventTarget = AnyDOMEventTarget,
>(
  types: TTypes,
  // | `${TTypes},${TTypes}`
  // | `${TTypes},${TTypes},${TTypes}`
  // | `${TTypes},${TTypes},${TTypes},${TTypes}`
  // | `${TTypes},${TTypes},${TTypes},${TTypes},${TTypes}`,
  selector: string,
  callback: EventCallback<TTarget, TTypes>,
) => {
  // Loop through each event type
  types.split(",").forEach((type) => {
    // Remove whitespace
    type = type.trim();
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
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    activeEvents[type]!.splice(index, 1);
  });
};

export default unlisten;
