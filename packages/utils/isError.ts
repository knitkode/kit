import { getType } from "./getType";

/**
 * Returns whether the payload is an Error
 *
 * @category is
 */
export let isError = (payload: any): payload is Error =>
  getType(payload) === "Error";
