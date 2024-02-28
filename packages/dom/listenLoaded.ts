import { on } from "./on";

/**
 * Fires a callback when the DOM content is loaded
 *
 * @see https://mathiasbynens.be/notes/settimeout-onload
 */
export let listenLoaded = (handler: (event: Event) => any) =>
  // document.addEventListener("DOMContentLoaded", setTimeout(handler, 4));
  on(document, "DOMContentLoaded", handler);

export default listenLoaded;
