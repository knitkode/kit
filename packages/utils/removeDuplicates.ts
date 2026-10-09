/**
 * Remove duplicated values from an array (compared with `SameValueZero`, like
 * a `Set`), keeping the first occurrence of each.
 *
 * @category array
 */
export let removeDuplicates = <T extends any[]>(arr: T) => [...new Set(arr)];

export default removeDuplicates;
