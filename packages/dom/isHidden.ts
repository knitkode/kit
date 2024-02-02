/**
 * Is element hidden?
 */
export let isHidden = <T extends HTMLElement>(el?: T) =>
  !el || el.offsetParent === null;
