/**
 * Returns whether the payload is ''
 *
 * @category is
 */
export let isEmptyString = (payload: any): payload is string => payload === "";

export default isEmptyString;
