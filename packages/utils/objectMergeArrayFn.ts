import objectMergeCreate from "./objectMergeCreate";

/**
 * Custom version with function merge support only for defined arrays
 *
 * @borrows [unjs/defu](https://github.com/unjs/defu)
 */
export const objectMergeArrayFn = objectMergeCreate(
  (object, key, currentValue) => {
    if (Array.isArray(object[key]) && typeof currentValue === "function") {
      object[key] = currentValue(object[key]);
      return true;
    }
    return false;
  },
);

export default objectMergeArrayFn;
