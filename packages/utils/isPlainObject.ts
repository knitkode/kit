import type { PlainObject } from "./getType";
import { getType } from "./getType";

/**
 * Returns whether the payload is a plain JavaScript object (excluding special classes or objects with other prototypes)
 *
 * @category is
 */
export let isPlainObject = (payload: any): payload is PlainObject =>
  getType(payload) !== "Object"
    ? false
    : payload.constructor === Object &&
      Object.getPrototypeOf(payload) === Object.prototype;
