import type { AnythingFalsy } from "./types";

/**
 * Round a number to the given amount of decimals
 *
 * If `keepZeroes` is `false` we normalises `x.00` to `x` and `x.10` to `x.1`
 *
 * @category number
 *
 * @param number
 * @param decimals default `undefined`
 * @param trailingZeroes default `undefined` Whether to keep trailing zeroes
 */
export let round = (
  number: number,
  decimals?: AnythingFalsy | number,
  trailingZeroes?: 1 | boolean | AnythingFalsy,
) =>
  decimals
    ? parseFloat(
        number.toFixed(decimals).replace(trailingZeroes ? "" : /\.+0*$/, ""),
      )
    : parseInt(number + "", 10);
