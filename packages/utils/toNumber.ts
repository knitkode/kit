import { isNumber } from "./isNumber";

/**
 * @category cast
 *
 * @param fallback Defaults to `0`
 */
export let toNumber = (input?: string | number, fallback?: number) =>
  isNumber(input) ? input : input ? parseFloat(input) : fallback || 0;

export default toNumber;
