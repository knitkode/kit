import type { LiteralUnion } from "type-fest";
import addClass from "./addClass";

/**
 * Shortcut for `document.createElement`, allowing to to create an HTML element
 * with a given className directly (a very common use case)
 */
export function createElement<
  TType extends LiteralUnion<keyof HTMLElementTagNameMap, string>,
  TElement extends HTMLElement = TType extends keyof HTMLElementTagNameMap
    ? HTMLElementTagNameMap[TType]
    : HTMLElement,
>(type: TType, className?: string) {
  const el = document.createElement(type) as TElement;
  if (className) {
    addClass(el, className);
  }
  return el;
}

export default createElement;
