import type { PlainObjectStringKeyed } from "./getType";
import { isPlainObject } from "./isPlainObject";

/**
 * Returns whether the payload is a plain JavaScript object (excluding special classes or objects with other prototypes)
 *
 * NB: This does not actually check at runtime whether object keys are `string`s,
 * it just narrow the type to that at TypeScript level.
 *
 * @category is
 * @deprecated Probably useless function
 */
export let isObjectStringKeyed = (
  payload: any,
): payload is PlainObjectStringKeyed =>
  isPlainObject<PlainObjectStringKeyed>(payload);

export default isObjectStringKeyed;
