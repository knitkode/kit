/**
 * Get an element's distance from the top and left of the Document, minus the
 * scroll of its offset parents.
 *
 * @param elem The HTML node element
 * @return Distance from the top and left in pixels
 */
export let getOffset = <T extends HTMLElement>(elem: T) => {
  let left = 0;
  let top = 0;

  while (elem && !isNaN(elem.offsetLeft) && !isNaN(elem.offsetTop)) {
    left += elem.offsetLeft;
    top += elem.offsetTop;
    // @ts-expect-error nevermind?
    elem = elem.offsetParent;
    // the element's own scroll does not move it, its offset parents' does
    if (elem) {
      left -= elem.scrollLeft;
      top -= elem.scrollTop;
    }
  }
  return { top, left };
};

export default getOffset;
