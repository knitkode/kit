/**
 * Replacement for native `toLowercase` tyescript ready (type narrowing ready)
 *
 * @category native
 */
export let lowercase = <T extends string>(str?: null | T) =>
  (str || "").toLowerCase() as Lowercase<T>;
