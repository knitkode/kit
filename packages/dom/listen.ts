import {
  type EventCallback,
  activeEvents,
  eventHandler,
} from "./_listen-delegation";
import { on } from "./on";
import type { AnyDOMEventTarget, AnyDOMEventType } from "./types";

// import { off } from "./off";

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
  // Make sure there's a selector and callback
  if (!selector || !callback) return;

  // Loop through each event type
  (types.split(",") as AnyDOMEventType[]).forEach(function (type) {
    // Remove whitespace
    type = type.trim() as AnyDOMEventType;

    // If no event of this type yet, setup
    if (!activeEvents[type]) {
      activeEvents[type] = [];
      on(window, type, eventHandler, true);
    }

    // Push to active events
    activeEvents[type]?.push({
      selector: selector,
      // @ts-expect-error FIXME: type...
      callback: callback,
    });
  });
};
