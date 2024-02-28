import type { PlainObject } from "./getType";
import { isPlainObject } from "./isPlainObject";

/**
 * Returns whether the payload is a plain JavaScript object (excluding special classes or objects with other prototypes)
 *
 * @category is
 */
export let isObject = (payload: any): payload is PlainObject =>
  isPlainObject(payload);

export default isObject;
