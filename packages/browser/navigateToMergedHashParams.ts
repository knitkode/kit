import {
  type AnyQueryParams,
  getUrlHashParams,
  mergeUrlQueryParams,
} from "@koine/utils";
import { navigateToHashParams } from "./navigateToHashParams";

/**
 * It updates the "query params" within the `location.hash`, it uses `location`
 *
 * @category location
 */
export let navigateToMergedHashParams = (
  params: NonNullable<AnyQueryParams> = {},
  hash = "",
) =>
  navigateToHashParams(
    mergeUrlQueryParams(getUrlHashParams(hash), params),
    hash,
  );
