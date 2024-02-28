/**
 * Checks if passed node exist and is a valid element.
 *
 * @borrows @glidejs/glide/src/utils/dom (source)
 */
export let exists = (node?: Element) =>
  node && node instanceof window.HTMLElement;

export default exists;
