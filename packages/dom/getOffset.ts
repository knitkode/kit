/**
 * Get an element's distance from the top and left of the Document.
 *
 * @param elem The HTML node element
 * @return Distance from the top and left in pixels
 */
export let getOffset = <T extends HTMLElement>(elem: T) => {
  let left = 0;
  let top = 0;

  while (elem && !isNaN(elem.offsetLeft) && !isNaN(elem.offsetTop)) {
    left += elem.offsetLeft - elem.scrollLeft;
    top += elem.offsetTop - elem.scrollTop;
    // @ts-expect-error nevermind?
    elem = elem.offsetParent;
  }
  return { top, left };
};

export default getOffset;
