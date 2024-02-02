import { isNull } from "./isNull";
import { isOneOf } from "./isOneOf";
import { isUndefined } from "./isUndefined";

/**
 * Returns true whether the payload is null or undefined
 *
 * @category is
 */
export let isNullOrUndefined = isOneOf(isNull, isUndefined);
