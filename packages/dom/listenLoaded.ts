import { on } from "./on";

/**
 * Fires a callback when the DOM content is loaded or, if it already is,
 * asynchronously with a synthetic `DOMContentLoaded` event
 *
 * @see https://mathiasbynens.be/notes/settimeout-onload
 *
 * @returns An automatic unbinding function to run to deregister the listener upon call
 */
export let listenLoaded = (handler: (event: Event) => void) => {
  const type = "DOMContentLoaded";
  if (document.readyState === "loading")
    return on(document as any, type as any, handler as any);
  const timeout = setTimeout(handler, 0, new Event(type));
  return () => clearTimeout(timeout);
};

export default listenLoaded;
