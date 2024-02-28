import { getType } from "./getType";

/**
 * Returns whether the payload is a Date, and that the date is valid
 *
 * @category is
 */
export let isDate = (payload: any): payload is Date =>
  getType(payload) === "Date" && !isNaN(payload);

export default isDate;
