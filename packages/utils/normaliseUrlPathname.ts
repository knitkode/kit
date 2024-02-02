import { removeTralingSlash } from "./removeTrailingSlash";

/**
 * Normalise URL pathname (relative URL)
 *
 * - replaces too many consecutive slashes
 * - removes the trailing slash
 *
 * @category location
 */
export let normaliseUrlPathname = (pathname = "") =>
  removeTralingSlash(pathname.replace(/\/+/g, "/"));
