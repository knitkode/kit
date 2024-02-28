import { getType } from "./getType";

/**
 * Returns whether the payload is a string
 *
 * @category is
 */
export let isString = (payload: any): payload is string =>
  getType(payload) === "String";

export default isString;
