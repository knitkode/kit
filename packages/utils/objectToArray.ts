/**
 * Quick typed replacement of `Object.keys(object).map(key => ...)`
 *
 * @category array
 * @category object
 */
export let objectToArray = <T extends object, R>(
  obj: T,
  iterator: (key: keyof T, index: number) => R,
): R[] =>
  Object.keys(obj).map(
    iterator as unknown as (key: string, idx: number, values: string[]) => R,
  );

export default objectToArray;
