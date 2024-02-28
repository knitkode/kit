import { getType } from "./getType";

/**
 * Returns whether the payload is a File
 *
 * @category is
 */
export let isFile = (payload: any): payload is File =>
  getType(payload) === "File";

export default isFile;
