import { isNumber } from "./isNumber";

/**
 * Returns whether the payload is a float number
 *
 * @category is
 */
export let isFloat = (payload: any): payload is number =>
  isNumber(payload) && Number.isFinite(payload) && payload % 1 !== 0;

export default isFloat;
