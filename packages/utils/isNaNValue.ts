import { getType } from "./getType";

/**
 * Returns whether the payload is literally the value `NaN` (it's `NaN` and also a `number`)
 *
 * @category is
 */
export let isNaNValue = (payload: any): payload is typeof NaN =>
  getType(payload) === "Number" && isNaN(payload);
