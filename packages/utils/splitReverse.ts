import type { Split } from "./split";
import type { Reverse } from "./types";

export type SplitReverse<S extends string, D extends string> = Reverse<
  Split<S, D>
>;

/**
 * Quick typed replacement for `string.split("delimiter").reverse()`
 *
 * @category string
 * @category text
 */
export let splitReverse = <T extends string, D extends string>(
  string: T,
  delimiter: D,
) => string.split(delimiter).reverse() as SplitReverse<T, D>;
