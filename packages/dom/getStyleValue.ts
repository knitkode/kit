/**
 * Return the current style value for an element CSS property
 *
 * @param el The element to compute
 * @param prop The style property
 */
export let getStyleValue = <T extends HTMLElement>(el: T, prop: string) =>
  getComputedStyle(el, null).getPropertyValue(prop);
