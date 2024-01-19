/**
 * For each, iterate through a `NodeList` or an `array` of `HTMLElement`s
 *
 * @param scope The optional `this` of the callback function
 */
export function forEach<T extends HTMLElement, TScope = object>(
  nodes: NodeListOf<T> | T[],
  callback: (this: TScope, $element: T, index: number) => any,
  scope?: TScope,
) {
  for (let i = 0; i < nodes.length; i++) {
    callback.call(scope as TScope, nodes[i] as T, i);
  }
}

export default forEach;
// /**
//  * For each, iterate through a `NodeList` or an `array` of `HTMLElement`s
//  *
//  * @param scope The optional `this` of the callback function
//  */
// export function forEach<TScope = object>(
//   nodes: HTMLElement[],
//   callback: (this: TScope, $element: HTMLElement, index: number) => any,
//   scope?: TScope
// ): void;
// export function forEach<TScope = object>(
//   nodes: NodeListOf<HTMLElement> | HTMLElement[],
//   callback: (this: TScope, $element: HTMLElement, index: number) => any,
//   scope?: TScope
// ): void;
// export function forEach<T extends Element, TScope = object>(
//   nodes: NodeListOf<T> | HTMLElement[],
//   callback: (this: TScope, $element: T, index: number) => any,
//   scope?: TScope
// ) {
//   for (let i = 0; i < nodes.length; i++) {
//     callback.call(scope as TScope, nodes[i] as T, i);
//   }
// }

// export default forEach;
