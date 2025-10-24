import type { Entries } from "type-fest";

/**
 * A simple shortcut for `Object.entries(object)` with typed keys
 * 
 * @category object
 */
export let objectEntries = <T extends object>(object: T): Entries<T> => 
  Object.entries(object) as Entries<T>;

export default objectEntries;
