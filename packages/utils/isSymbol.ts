import { getType } from "./getType";

/**
 * Returns whether the payload is a Symbol
 *
 * @category is
 */
export let isSymbol = (payload: any): payload is symbol =>
  getType(payload) === "Symbol";
