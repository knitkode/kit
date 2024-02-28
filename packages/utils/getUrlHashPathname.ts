/**
 * It returns the "pathname" cleaned up from the `#` and the initial slashes
 * extracting it from the given `hash` string or, if not provided, failling
 * back reading the `location.hash`
 *
 * @category location
 */
export let getUrlHashPathname = (hash = "") =>
  (hash || location.hash).split("?")[0].replace(/^#\//, "");

export default getUrlHashPathname;
