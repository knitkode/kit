import { getType } from "./getType";

/**
 * Returns whether the payload is an array
 *
 * @category is
 */
export let isArray = (payload: any): payload is any[] =>
  getType(payload) === "Array";
