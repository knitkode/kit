import { isArray } from "./isArray";

/**
 * Returns whether the payload is a an array with at least 1 item
 *
 * @category is
 */
export let isFullArray = (payload: any): payload is any[] =>
  isArray(payload) && payload.length > 0;

export default isFullArray;
