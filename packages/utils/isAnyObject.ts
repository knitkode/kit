import type { PlainObject } from "./getType";
import { getType } from "./getType";

/**
 * Returns whether the payload is an any kind of object (including special classes or objects with different prototypes)
 *
 * @category is
 */
export let isAnyObject = (payload: any): payload is PlainObject =>
  getType(payload) === "Object";
