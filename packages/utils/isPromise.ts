import { getType } from "./getType";

/**
 * Returns whether the payload is a Promise
 *
 * @category is
 */
export let isPromise = (payload: any): payload is Promise<any> =>
  getType(payload) === "Promise";

export default isPromise;
