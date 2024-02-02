import { type AnyQueryParams, getUrlQueryParams } from "@koine/utils";
import { navigateToParams } from "./navigateToParams";

/**
 * Remove URL query parameter, it uses `history`
 *
 * @category location
 * @param replace Replace URL instead of pushing it in the history stack. By default it pushes it.
 */
export let navigateWithoutUrlParam = (
  paramName?: string,
  replace?: boolean,
) => {
  const params: NonNullable<AnyQueryParams> = {};
  const currentParams = getUrlQueryParams();
  for (const key in currentParams) {
    if (key !== paramName) {
      params[key] = currentParams[key];
    }
  }

  return navigateToParams(params, replace);
};
