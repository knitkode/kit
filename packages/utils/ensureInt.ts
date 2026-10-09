/**
 * Ensure input to be an integer: decimals are dropped (`1.9` and `"1.9"` both
 * give `1`), never rounded. Non numeric input gives `NaN`, as with `parseInt`.
 *
 * @category cast
 */
export let ensureInt = (input: string | number) =>
  typeof input === "string" ? parseInt(input, 10) : Math.trunc(input);

export default ensureInt;
