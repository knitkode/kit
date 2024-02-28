import { getType } from "./getType";

/**
 * Returns whether the payload is undefined
 *
 * @category is
 */
export let isUndefined = (payload: any): payload is undefined =>
  getType(payload) === "Undefined";

export default isUndefined;
