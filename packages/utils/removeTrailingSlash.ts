/**
 * Strips out the trailing slash
 *
 * @category location
 */
export let removeTrailingSlash = (urlLike?: string | null) =>
  (urlLike || "").replace(/\/*$/, "");

export default removeTrailingSlash;
