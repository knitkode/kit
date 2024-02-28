import { getType } from "./getType";

/**
 * Returns whether the payload is a FormData
 *
 * @category is
 */
export let isFormData = (payload: any): payload is FormData =>
  getType(payload) === "FormData";

export default isFormData;
