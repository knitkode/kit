import { removeTrailingSlash } from "./removeTrailingSlash";

/**
 * Normalise URL, it works both for absolute and relative URLs
 *
 * - replaces too many consecutive slashes (except `http{s}://`)
 * - removes the trailing slash
 *
 * @category location
 * @see https://stackoverflow.com/a/40649435/1938970
 */
export let normaliseUrl = (absoluteUrl = "") =>
  removeTrailingSlash(absoluteUrl.replace(/(:\/\/)|(\/)+/g, "$1$2"));

export default normaliseUrl;
