import {
  type EventCallback,
  activeEvents,
  eventHandler,
} from "./_listen-delegation";
import { on } from "./on";
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
 * Listen an event
 *
 * @category listen-delegation
 *
 * @param types The event type or types (comma separated)
 * @param selector The selector to run the event on
 * @param callback The function to run when the event fires
 */
export let listen = <
  TTypes extends CommaSeparatedListOf<AnyWindowEventType>,
  TTarget extends AnyDOMEventTarget = AnyDOMEventTarget,
>(
  types: TTypes,
  selector: string,
  callback: EventCallback<TTarget>,
) => {
  // Make sure there's a selector and callback
  if (!selector || !callback) return;

  // Loop through each event type
  (types.split(",") as AnyWindowEventType[]).forEach(function (type) {
    // Remove whitespace
    type = type.trim() as AnyWindowEventType;

    // If no event of this type yet, setup
    if (!activeEvents[type]) {
      activeEvents[type] = [];
      on(window, type, eventHandler, true);
    }

    // Push to active events
    activeEvents[type]?.push({
      selector: selector,
      // FIXME: remove assertion, fix type
      callback: callback as never,
    });
  });
};

export default listen;
