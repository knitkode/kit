/**
 * Escape colons to allow use class names as `.module:block__element`
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector#Escaping_special_characters
 *
 * @param selector
 */
export let escapeSelector = (selector: string) => selector.replace(/:/g, "\\:");

export default escapeSelector;
