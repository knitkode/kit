import { domAll } from "./domAll";

/**
 * Each shortcut, iterate through a NodeList of HTMLElements retrieved with the
 * given selector (and optionally a parent container passed as thrid arguement)
 *
 * @param selector DOM selector
 * @param callback
 * @param parent It falls back to `window.document`
 * @param scope
 */
export let domEach = <T extends Element = HTMLElement>(
  selector: string,
  callback: ($element: T, index: number) => any,
  parent?: Element | HTMLElement | Document | null,
  scope?: object,
) => {
  const nodes = domAll(selector, parent);
  for (let i = 0; i < nodes.length; i++) {
    callback.call(scope, nodes[i] as unknown as T, i);
  }
};

export default domEach;
