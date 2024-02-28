import { getType } from "./getType";

/**
 * Returns whether the payload is a WeakMap
 *
 * @category is
 */
export let isWeakMap = (payload: any): payload is WeakMap<any, any> =>
  getType(payload) === "WeakMap";

export default isWeakMap;
