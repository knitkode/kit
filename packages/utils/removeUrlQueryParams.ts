import buildUrlQueryString from "./buildUrlQueryString";
import getUrlQueryParams from "./getUrlQueryParams";
import { type AnyQueryParams } from "./location";

/**
 * Remove the given keys from the given URL query parameters
 *
 * @category location
 */
export function removeUrlQueryParams(
  url: string,
  paramsToRemove: string[] = [],
) {
  const parts = url.split("?");
  const allParams = getUrlQueryParams(url);
  const params: NonNullable<AnyQueryParams> = {};

  for (const key in allParams) {
    if (!paramsToRemove.includes(key)) {
      params[key] = allParams[key];
    }
  }
  return parts[0] + buildUrlQueryString(params);
}

export default removeUrlQueryParams;
