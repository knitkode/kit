/**
 * Get the current width of the window's scrollbar or, given an element, of its
 * vertical scrollbar (plus its left and right borders, if any)
 */
export let getScrollbarWidth = <T extends HTMLElement>(element?: T) =>
  element
    ? element.offsetWidth - element.clientWidth
    : window.innerWidth - document.documentElement.clientWidth;

export default getScrollbarWidth;
