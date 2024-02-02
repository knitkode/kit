import type { AnyQueryParams } from "./location";

/**
 * It returns the "query params" as an object extracting it from the given `hash`
 * string or, if not provided, failling back reading the `location.hash`
 *
 * @category location
 */
export let getUrlHashParams = <T extends NonNullable<AnyQueryParams>>(
  hash = "",
) => {
  hash = hash || location.hash;
  const hashParts = hash.split("?");
  if (hashParts.length >= 1) {
    return Object.fromEntries(new URLSearchParams(hashParts[1])) as T;
  }
  return {} as T;
};
