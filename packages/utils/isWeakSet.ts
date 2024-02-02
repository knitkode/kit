import { getType } from "./getType";

/**
 * Returns whether the payload is a WeakSet
 *
 * @category is
 */
export let isWeakSet = (payload: any): payload is WeakSet<any> =>
  getType(payload) === "WeakSet";
