import { isString } from "./isString";

/**
 * Returns whether the payload is a string, BUT returns false for ''
 *
 * @category is
 */
export let isFullString = (payload: any): payload is string =>
  isString(payload) && payload !== "";

export default isFullString;
