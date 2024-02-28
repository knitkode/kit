import { debounce } from "@koine/utils";
import { listenResize } from "./listenResize";

/**
 * Listen element's (`window` by default) _resize_ event debouncing the callback
 *
 * @returns An automatic unbinding function to run to deregister the listener upon call
 */
export let listenResizeDebounced = (
  el?: Parameters<typeof listenResize>[1],
  ...args: Parameters<typeof debounce>
) => listenResize(debounce(...args), el);

// EXP: with too complex overload signature...
// import { debounce, isUndefined } from "@koine/utils";
// import { listenResize } from "./listenResize";

// /**
//  * Listen element's (`window` by default) _resize_ event debouncing the callback
//  *
//  * @returns An automatic unbinding function to run to deregister the listener upon call
//  */
// export function listenResizeDebounced(
//   ...args: Parameters<typeof debounce>
// ): ReturnType<typeof listenResize>;
// export function listenResizeDebounced(
//   el: Parameters<typeof listenResize>[1],
//   ...args: Parameters<typeof debounce>
// ): ReturnType<typeof listenResize>;
// export function listenResizeDebounced(
//   ...args:
//     | [Parameters<typeof listenResize>[1], ...Parameters<typeof debounce>]
//     | Parameters<typeof debounce>
// ) {
//   if (isUndefined(args[0])) {
//     return listenResize(debounce(...args));
//   }
//   return listenResize(debounce(...args.slice(1)), args[0]);
// }

export default listenResizeDebounced;
