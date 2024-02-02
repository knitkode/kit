import {
  type AnyQueryParams,
  buildUrlQueryString,
  isBrowser,
} from "@koine/utils";

/**
 * Redirect to url with params {optionally}, removes eventual trailing question
 * marks from the given URL, it uses `location`
 *
 * @category location
 */
export let redirectTo = (url: string, params?: AnyQueryParams) => {
  if (isBrowser) {
    const queryString = buildUrlQueryString(params);
    location.href = url.replace(/\?+$/g, "") + queryString;
  }
};
