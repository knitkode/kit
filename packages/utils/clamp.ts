/**
 * Returns a number whose value is limited to the given range.
 *
 * @category math
 * @see https://stackoverflow.com/a/11409944/1938970
 */
export const clamp = (num: number, min: number, max: number) =>
  Math.min(Math.max(num, min), max);

export default clamp;
