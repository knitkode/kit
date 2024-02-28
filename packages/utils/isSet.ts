import { getType } from "./getType";

/**
 * Returns whether the payload is a Set
 *
 * @category is
 */
export let isSet = (payload: any): payload is Set<any> =>
  getType(payload) === "Set";

export default isSet;
