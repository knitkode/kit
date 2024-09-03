import { removeTrailingSlash } from "./removeTrailingSlash";

/**
 * Normalise URL pathname (relative URL)
 *
 * - replaces too many consecutive slashes
 * - removes the trailing slash
 *
 * @category location
 * @returns Empty string if given `pathname` is undefined
 */
export let normaliseUrlPathname = (pathname = "") =>
  removeTrailingSlash(pathname.replace(/\/+/g, "/"));

export default normaliseUrlPathname;
