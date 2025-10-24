/**
 * A simple shortcut for `Object.keys(object)` with typed keys
 * 
 * @category object
 */
export let objectKeys = <T extends object>(object: T): (keyof T)[] =>
  Object.keys(object) as (keyof T)[];

export default objectKeys;
