import { getType } from "./getType";

/**
 * Returns whether the payload is a boolean
 *
 * @category is
 */
export let isBoolean = (payload: any): payload is boolean =>
  getType(payload) === "Boolean";
