/**
 * Truncate string
 *
 * @category text
 */
export let truncate = (
  input: undefined | null | string,
  length: number,
): string =>
  input
    ? input.length > length
      ? input.substring(0, length) + "..."
      : input
    : "";

export default truncate;
