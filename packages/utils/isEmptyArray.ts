import { isArray } from "./isArray";

/**
 * Returns whether the payload is a an empty array
 *
 * @category is
 */
export let isEmptyArray = (payload: any): payload is [] =>
  isArray(payload) && payload.length === 0;
