/**
 * Get an element's distance from the top of the Document (using more modern/performant
 * technique compared to {@link ./getOffsetTop})
 *
 * @see https://stackoverflow.com/q/5598743/1938970
 *
 * @param elem The HTML node element
 * @return Distance from the top in pixels
 */
export let getOffsetTopSlim = <T extends HTMLElement>(elem: T) =>
  elem.getBoundingClientRect().top + window.scrollY;
