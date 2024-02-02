/**
 * Returns whether the payload is a numeric literal (integer or float)
 *
 * This will return `false` for `NaN`!!
 *
 * @category is
 */
export let isNumericLiteral = (payload: string): payload is `${number}` =>
  /^[0-9]+.{0,1}[0-9]+|[0-9]$/.test(payload);
