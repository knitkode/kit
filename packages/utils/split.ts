export type Split<S extends string, D extends string> = string extends S
  ? string[]
  : S extends ""
    ? []
    : S extends `${infer T}${D}${infer U}`
      ? [T, ...Split<U, D>]
      : [S];

/**
 * Quick typed replacement for `string.split("delimiter")`
 *
 * @category string
 * @category text
 */
export const split = <T extends string, D extends string>(
  string: T,
  delimiter: D,
) => string.split(delimiter) as Split<T, D>;

export default split;
