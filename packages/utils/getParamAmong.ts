import { getParamAsString } from "./getParamAsString";

/**
 * Get query parameter as `string` treating the `ParsedUrlQuery` result of
 * [`querystring`](https://nodejs.org/api/querystring.html) (used in next.js
 * router and elsewhere)
 *
 * @category location
 *
 * @param raw The _raw_ query parameter
 * @param allowedValues The list of values (as strings) that the parameter can
 * have, if not one of them `null` is returned
 */
export let getParamAmong = <T extends string[]>(
  raw?: string | string[],
  allowedValues: T = [] as unknown as T,
) => {
  const string = getParamAsString(raw);
  return allowedValues.includes(string) ? (string as T[number]) : null;
};
