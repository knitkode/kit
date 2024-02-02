import { isArray } from "./isArray";

/**
 * Get query parameter as `string` treating the `ParsedUrlQuery` result of
 * [`querystring`](https://nodejs.org/api/querystring.html) (used in next.js
 * router and elsewhere)
 *
 * @category location
 *
 * @param raw The _raw_ query parameter
 */
export let getParamAsString = (raw?: string | string[]) =>
  (isArray(raw) ? raw[0] : raw) || "";
