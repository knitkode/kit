import { getParamAsString } from "./getParamAsString";

/**
 * Get query parameter as `int`eger treating the `ParsedUrlQuery` result of
 * [`querystring`](https://nodejs.org/api/querystring.html) (used in next.js
 * router and elsewhere)
 *
 * @category location
 *
 * @param raw The _raw_ query parameter
 * @param fallback Fallback number, we return `null` if not provided
 */
export let getParamAsInt = <TFallback extends number | null | undefined>(
  raw?: string | string[],
  fallback: TFallback = null as TFallback,
) => {
  const string = getParamAsString(raw);
  if (string) {
    return parseInt(string, 10);
  }
  return fallback;
};
