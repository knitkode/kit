import { isString } from "./isString";

/**
 * Ensure to transform a JavaScript `Error` into a string (uses its `message`)
 *
 * @category error
 * @category cast
 */
export let errorToString = (e: unknown) =>
  e instanceof Error ? e.message : isString(e) ? e : "";

export default errorToString;
