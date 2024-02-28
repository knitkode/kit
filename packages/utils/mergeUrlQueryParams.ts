import { isNull } from "./isNull";
import type { AnyQueryParams } from "./location";

/**
 * Merge query parameters objects, it *mutates* the first given object argument
 *
 * @category location
 */
export let mergeUrlQueryParams = <T extends AnyQueryParams>(
  oldParams: NonNullable<AnyQueryParams> = {},
  newParams: NonNullable<AnyQueryParams> = {},
) => {
  for (const key in newParams) {
    const value = newParams[key];

    if (oldParams[key] && isNull(value)) {
      delete oldParams[key];
    } else {
      oldParams[key] = value;
    }
  }

  return oldParams as T;
};

export default mergeUrlQueryParams;
