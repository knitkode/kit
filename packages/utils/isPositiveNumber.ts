import { isNumber } from "./isNumber";

/**
 * Returns whether the payload is a positive number (but not 0)
 *
 * @category is
 */
export let isPositiveNumber = (payload: any): payload is number =>
  isNumber(payload) && payload > 0;

export default isPositiveNumber;
