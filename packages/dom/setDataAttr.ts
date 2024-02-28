/**
 * Set data attribute
 *
 * @param element
 * @param attribute The name of the `data-{attr}`
 * @param value The value to set, `null` or `undefined` will remove the attribute
 */
export let setDataAttr = <T extends Element>(
  element: T,
  attribute: string,
  value?: string | number | null | boolean,
) => {
  if (value === null || typeof value === "undefined") {
    // delete element.dataset[attribute];
    // return;
    element.removeAttribute("data-" + attribute);
    return;
  }
  // element.dataset[attribute] = value.toString();
  element.setAttribute("data-" + attribute, value.toString());
};

export default setDataAttr;
