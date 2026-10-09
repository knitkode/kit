import type { AnythingFalsy } from "./types";

/**
 * Round a number to the given amount of decimals (none by default)
 *
 * The result is a number, so `round(1.1, 2)` gives `1.1`: pass `trailingZeroes`
 * to get the formatted string with the trailing zeroes instead (`"1.10"`).
 *
 * @category number
 *
 * @param number
 * @param decimals default `0`
 * @param trailingZeroes Whether to return a string keeping the trailing zeroes
 */
export function round(
  number: number,
  decimals?: AnythingFalsy | number,
  trailingZeroes?: AnythingFalsy,
): number;
export function round(
  number: number,
  decimals: AnythingFalsy | number,
  trailingZeroes: 1 | true,
): string;
export function round(
  number: number,
  decimals?: AnythingFalsy | number,
  trailingZeroes?: 1 | boolean | AnythingFalsy,
): number | string;
export function round(
  number: number,
  decimals?: AnythingFalsy | number,
  trailingZeroes?: 1 | boolean | AnythingFalsy,
) {
  const fixed = number.toFixed(decimals || 0);

  return trailingZeroes ? fixed : Number(fixed);
}

export default round;
