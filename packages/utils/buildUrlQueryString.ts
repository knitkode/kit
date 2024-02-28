import { isArray } from "./isArray";
import { isNull } from "./isNull";
import { isUndefined } from "./isUndefined";
import type { AnyQueryParams } from "./location";

/**
 * Get clean query string for URL
 *
 * It returns the query string **with** the initial `?`
 *
 * TODO: at some point replace with `URLSearchParams`, @see [caniuse](https://caniuse.com/?search=URLSearchParams)
 *
 * @category location
 */
export let buildUrlQueryString = <T extends AnyQueryParams>(params: T) => {
  let output = "";

  if (!params) return output;

  for (const key in params) {
    const value = params[key];
    if (isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        output += `${key}=${encodeURIComponent(value[i] + "")}&`;
      }
    } else if (!isNull(value) && !isUndefined(value)) {
      output += `${key}=${encodeURIComponent(value + "")}&`;
    }
  }

  // removes the last &
  return output ? `?${output.replace(/&+$/, "")}` : "";
};

export default buildUrlQueryString;
