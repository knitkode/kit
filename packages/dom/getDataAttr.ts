// TODO: maybe move to `dataset` API but consider the comment about Safari here
// https://stackoverflow.com/a/9201264/1938970

/**
 * Get data attribute
 *
 * @param element
 * @param attribute The name of the `data-{attr}`
 */
export let getDataAttr = (element: HTMLElement, attribute: string) =>
  // element.dataset[attribute];
  element.getAttribute("data-" + attribute);

export default getDataAttr;
