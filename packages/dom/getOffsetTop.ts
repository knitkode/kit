/**
 * Get an element's distance from the top of the Document.
 *
 * @see https://vanillajstoolkit.com/helpers/getoffsettop/
 *
 * @param elem The HTML node element
 * @return Distance from the top in pixels
 */
export let getOffsetTop = <T extends HTMLElement>(elem: T) => {
  let location = 0;
  if (elem.offsetParent) {
    while (elem) {
      location += elem.offsetTop;
      // @ts-expect-error nevermind?
      elem = elem.offsetParent;
    }
  }
  return location >= 0 ? location : 0;
};
