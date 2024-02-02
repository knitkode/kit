import { getType } from "./getType";

/**
 * Returns whether the payload is a Blob
 *
 * @category is
 */
export let isBlob = (payload: any): payload is Blob =>
  getType(payload) === "Blob";
