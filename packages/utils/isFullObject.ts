import type { PlainObject } from "./getType";
import { isPlainObject } from "./isPlainObject";

/**
 * Returns whether the payload is a an empty object (excluding special classes or objects with other prototypes)
 *
 * @category is
 */
export let isFullObject = (payload: any): payload is PlainObject =>
  isPlainObject(payload) && Object.keys(payload).length > 0;

export default isFullObject;
