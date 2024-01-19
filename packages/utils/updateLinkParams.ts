import { type AnyQueryParams } from "./location";
import updateUrlQueryParams from "./updateUrlQueryParams";

/**
 * Update link `<a href="">` merging the given new query parameters.
 * it returns the newly created `href` URL value
 *
 * @category location
 * @pure
 */
export function updateLinkParams(
  $anchor: HTMLAnchorElement,
  newParams: NonNullable<AnyQueryParams>,
) {
  const href = updateUrlQueryParams($anchor.href, newParams);
  $anchor.href = href;
  return href;
}

export default updateLinkParams;
