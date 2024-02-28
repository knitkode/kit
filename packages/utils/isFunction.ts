import type { AnyFunction } from "./getType";

/**
 * Returns whether the payload is a function (regular or async)
 *
 * @category is
 */
export let isFunction = (payload: any): payload is AnyFunction =>
  typeof payload === "function";

export default isFunction;
