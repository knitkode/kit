import { isNumber } from "./isNumber";

/**
 * @category cast
 *
 * @param fallback Defaults to `0`
 */
export let toNumber = (input?: null | string | number, fallback?: number) => {
  if (isNumber(input)) return input;
  const parsed = input ? parseFloat(input) : input;
  return isNumber(parsed) ? parsed : fallback || 0;
}

export default toNumber;
