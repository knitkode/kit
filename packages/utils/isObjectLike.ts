import { type PlainObject } from "./getType";
import isAnyObject from "./isAnyObject";

/**
 * Returns whether the payload is an object like a type passed in < >
 *
 * Usage: isObjectLike<{id: any}>(payload) // will make sure it's an object and has an `id` prop.
 *
 * @category is
 */
export function isObjectLike<T extends PlainObject>(
  payload: any,
): payload is T {
  return isAnyObject(payload);
}

export default isObjectLike;
