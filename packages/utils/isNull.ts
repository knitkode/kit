import { getType } from "./getType";

/**
 * Returns whether the payload is null
 *
 * @category is
 */
export let isNull = (payload: any): payload is null =>
  getType(payload) === "Null";

export default isNull;
