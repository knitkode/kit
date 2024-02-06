/**
 * Returns whether the payload is a numeric literal (integer or float)
 *
 * This will return `false` for `NaN`!!
 *
 * @category is
 * @borrows [SO's answer by Paul](https://stackoverflow.com/a/10256077/1938970)
 */
export let isNumericLiteral = (payload: string): payload is `${number}` =>
  /^[+-]?\d+(\.\d+)?$/.test(payload);
