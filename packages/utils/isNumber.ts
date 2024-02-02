import { getType } from "./getType";

/**
 * Returns whether the payload is a number (but not NaN)
 *
 * This will return `false` for `NaN`!!
 *
 * @category is
 */
export let isNumber = (payload: any): payload is number =>
  getType(payload) === "Number" && !isNaN(payload);
