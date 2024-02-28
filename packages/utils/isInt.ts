import { isNumber } from "./isNumber";

/**
 * Returns whether the payload is an integer number
 *
 * @category is
 */
export let isInt = (payload: any): payload is number =>
  isNumber(payload) && payload % 1 === 0;

export default isInt;
