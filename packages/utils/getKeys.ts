/**
 * Type safe replacement for `Object.keys(myObject)` to iterate over a record
 * without loosing the key's types in simple `string`s.
 *
 * @category native
 * @category object
 * @see https://stackoverflow.com/a/59459000/1938970
 */
export let getKeys = Object.keys as <T extends object>(
  obj: T,
) => Array<keyof T>;
