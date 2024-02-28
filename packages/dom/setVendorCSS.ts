/**
 * Set vendor CSS rule
 *
 * @param element A single HTMLElement
 * @param prop CSS rule proerty
 * @param value The CSS value to set, it will be automatically vendor prefixed
 */
export let setVendorCSS = <T extends HTMLElement>(
  element: T,
  prop: string,
  value: string | number | boolean,
) => {
  const propUpper = prop.charAt(0).toUpperCase() + prop.slice(1);
  // @ts-expect-error nevermind now...
  element.style["webkit" + propUpper] = value;
  // @ts-expect-error nevermind now...
  element.style["moz" + propUpper] = value;
  // @ts-expect-error nevermind now...
  element.style["ms" + propUpper] = value;
  // @ts-expect-error nevermind now...
  element.style["o" + propUpper] = value;
  // @ts-expect-error nevermind now...
  element.style[prop] = value;
};

export default setVendorCSS;
