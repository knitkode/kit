/**
 * Convert range of a number
 *
 * e.g. converting number 5 in a scale/range from 0 10 to a scale/range from 50
 * to 100 would return 75
 * @example
 *
 * ```ts
 * convertRange(5, [0, 10], [50, 100]);
 * ```
 *
 * @category math
 * @see https://stackoverflow.com/a/14224813
 */
export let convertRange = (num: number, r1: number[], r2: number[]): number =>
  ((num - r1[0]) * (r2[1] - r2[0])) / (r1[1] - r1[0]) + r2[0];
