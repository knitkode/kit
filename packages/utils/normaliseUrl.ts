import { removeTrailingSlash } from "./removeTrailingSlash";

const REGEX_NORMALISE_URL = /(:\/\/)|(\/)+/g;

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
  removeTrailingSlash(absoluteUrl.replace(REGEX_NORMALISE_URL, "$1$2"));

export default normaliseUrl;
