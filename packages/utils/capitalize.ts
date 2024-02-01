/**
 * Capitalize first letter of the given string.
 *
 * @category text
 * @resources
 * - https://stackoverflow.com/a/11409944/1938970
 */
export const capitalize = <T extends string>(string?: null | T) =>
  ((string || "").charAt(0).toUpperCase() +
    (string || "").slice(1)) as Capitalize<T>;

export default capitalize;
