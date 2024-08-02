/* eslint-disable eqeqeq */
// import { OBJECT, isUndefined } from './shared'
import { isUndefined } from "./isUndefined";

const OBJECT = Object;

// use WeakMap to store the object->key mapping
// so the objects can be garbage collected.
// WeakMap uses a hashtable under the hood, so the lookup
// complexity is almost O(1).
const table = new WeakMap<object, number | string>();

// counter of the key
let counter = 0;

/**
 * A stable hash implementation that supports:
 * - Fast and ensures unique hash properties
 * - Handles unserializable values
 * - Handles object key ordering
 * - Generates short results
 *
 * This is not a serialization function, and the result is not guaranteed to be
 * parsable.
 *
 * @borrows [`swr`'s `stableHash`](https://github.com/vercel/swr/blob/main/src/_internal/utils/shared.ts)
 *
 * That is not exported by the package, the following is not possible:
 * ```js
 * import { stableHash } from "swr/_internal/dist";
 * ```
 */
export const hashAny = (arg: any): string => {
  const type = typeof arg;
  const constructor = arg && arg.constructor;
  const isDate = constructor == Date;

  let result: any;
  let index: any;

  if (OBJECT(arg) === arg && !isDate && constructor != RegExp) {
    // Object/function, not null/date/regexp. Use WeakMap to store the id first.
    // If it's already hashed, directly return the result.
    result = table.get(arg);
    if (result) return result;

    // Store the hash first for circular reference detection before entering the
    // recursive `hashAny` calls.
    // For other objects like set and map, we use this id directly as the hash.
    result = ++counter + "~";
    table.set(arg, result);

    if (constructor == Array) {
      // Array.
      result = "@";
      for (index = 0; index < arg.length; index++) {
        result += hashAny(arg[index]) + ",";
      }
      table.set(arg, result);
    }
    if (constructor == OBJECT) {
      // Object, sort keys.
      result = "#";
      const keys = OBJECT.keys(arg).sort();
      while (!isUndefined((index = keys.pop() as string))) {
        if (!isUndefined(arg[index])) {
          result += index + ":" + hashAny(arg[index]) + ",";
        }
      }
      table.set(arg, result);
    }
  } else {
    result = isDate
      ? arg.toJSON()
      : type == "symbol"
        ? arg.toString()
        : type == "string"
          ? JSON.stringify(arg)
          : "" + arg;
  }

  return result;
};

export default hashAny;
