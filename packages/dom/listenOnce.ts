import type { EventCallback } from "./_listen-delegation";
import { listen } from "./listen";
import type { AnyWindowEventType } from "./types";
import { unlisten } from "./unlisten";

/**
 * Listen an event, and automatically unlisten it after it's first run
 *
 * @category listen-delegation
 *
 * @param types The event type or types (comma separated)
 * @param selector The selector to run the event on
 * @param callback The function to run when the event fires
 */
export let listenOnce = (
  types: string,
  selector: string,
  callback: EventCallback,
) => {
  const temp: EventCallback = (event, target) => {
    callback(event, target);
    unlisten(types as AnyWindowEventType, selector, temp);
  };
  // lets `unlisten` find this listener from the original callback too
  (temp as any).o = callback;
  listen(types as AnyWindowEventType, selector, temp);
};

export default listenOnce;
