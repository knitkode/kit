import { getType } from "./getType";

/**
 * Returns whether the payload is a regular expression (RegExp)
 *
 * @category is
 */
export let isRegExp = (payload: any): payload is RegExp =>
  getType(payload) === "RegExp";
