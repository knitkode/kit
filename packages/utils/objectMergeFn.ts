import objectMergeCreate from "./objectMergeCreate";

/**
 * Custom version with function merge support
 * 
 * @borrows [unjs/defu](https://github.com/unjs/defu)
 */
export const objectMergeFn = objectMergeCreate((object, key, currentValue) => {
  if (object[key] !== undefined && typeof currentValue === "function") {
    object[key] = currentValue(object[key]);
    return true;
  }
  return false;
});

export default objectMergeFn;
