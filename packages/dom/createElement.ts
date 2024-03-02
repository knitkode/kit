// import type { LiteralUnion } from "@koine/utils";
import { addClass } from "./addClass";

// FIXME: inline the typ or the rollup build breaks?
type LiteralUnion<LiteralType, BaseType extends string> =
  | LiteralType
  | (BaseType & Record<never, never>);

/**
 * Shortcut for `document.createElement`, allowing to to create an HTML element
 * with a given className directly (a very common use case)
 */
export let createElement = <
  TType extends LiteralUnion<keyof HTMLElementTagNameMap, string>,
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
