import { addClass } from "./addClass";

/**
 * Shortcut for `document.createElement`, allowing to to create an HTML element
 * with a given className directly (a very common use case)
 */
export let createElement = <
  TType extends keyof HTMLElementTagNameMap | string,
  TElement extends HTMLElement = TType extends keyof HTMLElementTagNameMap
    ? HTMLElementTagNameMap[TType]
    : HTMLElement,
>(
  type: TType,
  className?: string,
) => {
  const el = document.createElement(type) as TElement;
  if (className) {
    addClass(el, className);
  }
  return el;
};

export default createElement;
