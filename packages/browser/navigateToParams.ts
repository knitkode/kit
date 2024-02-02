import {
  type AnyQueryParams,
  buildUrlQueryString,
  isBrowser,
} from "@koine/utils";
import { navigateToUrl } from "./navigateToUrl";

/**
 * Change current URL query parameters, it uses `history`.
 *
 * @category location
 * @param replace Replace URL instead of pushing it in the history stack. By default it pushes it.
 * @returns The query string with initial `?`
 */
export let navigateToParams = (
  params: string | AnyQueryParams = {},
  replace?: boolean,
) => {
  const queryString =
    typeof params === "string" ? params : buildUrlQueryString(params);

  if (isBrowser) {
    navigateToUrl(location.pathname + queryString, replace);
  }

  return queryString;
};
