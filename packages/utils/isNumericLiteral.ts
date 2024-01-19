/**
 * Returns whether the payload is a numeric literal (integer or float)
 *
 * This will return `false` for `NaN`!!
 *
 * @category is
 */
export function isNumericLiteral(payload: string): payload is `${number}` {
  return /^[0-9]+.{0,1}[0-9]+$/.test(payload);
}

export default isNumericLiteral;
