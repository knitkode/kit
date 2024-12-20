import type { PlainObject } from "./getType";
import { getType } from "./getType";

/**
 * Returns whether the payload is a plain JavaScript object (excluding special classes or objects with other prototypes)
 *
 * @category is
 */
// TODO: check https://github.com/sindresorhus/is-plain-obj more precise
export let isPlainObject = <TReturn = PlainObject>(
  payload: any,
): payload is TReturn => {
  const type = getType(payload);
  return (
    type === "Module" ||
    (type !== "Object"
      ? false
      : payload.constructor === Object &&
        Object.getPrototypeOf(payload) === Object.prototype)
  );
};

export default isPlainObject;
