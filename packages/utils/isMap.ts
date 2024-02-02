import { getType } from "./getType";

/**
 * Returns whether the payload is a Map
 *
 * @category is
 */
export let isMap = (payload: any): payload is Map<any, any> =>
  getType(payload) === "Map";
