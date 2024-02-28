/**
 * Ensure input to be an integer
 *
 * @category cast
 */
export let ensureInt = (input: string | number) =>
  typeof input === "string" ? parseInt(input, 10) : Math.round(input);

export default ensureInt;
