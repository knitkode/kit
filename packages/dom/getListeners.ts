import { activeEvents } from "./_listen-delegation";

/**
 * Get an immutable copy of all active event listeners
 *
 * @category listen-delegation
 *
 * @return Active event listeners
 */
export let getListeners = () => {
  const obj: typeof activeEvents = {};
  for (const type in activeEvents) {
    // if (activeEvents.hasOwnProperty(type)) {
    obj[type] = activeEvents[type];
    // }
  }
  return obj;
};
