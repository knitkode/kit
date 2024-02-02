/**
 * Strips out the trailing slash
 *
 * @category location
 */
export let removeTralingSlash = (urlLike?: string | null) =>
  (urlLike || "").replace(/\/*$/, "");
