import { objectSort } from "./objectSort";

/**
 * @category object
 *
 * @pure
 * @param data The object whose properties you want to sort
 * @param keyMatch The value to compare to each `data` object keys, the ones
 * matching it is sorted first, the rest are sorted by `localeCompare` on keys
 * @returns a _new_ object
 */
export let objectSortByKeysMatching = <T extends object>(
  data: T,
  keyMatch: keyof T,
) => objectSort(data, ([a], [b]) => (a === keyMatch ? -1 : a.localeCompare(b)));
// Object.fromEntries(
//   Object.entries(data).sort(([a], [b]) =>
//     a === keyMatch ? -1 : a.localeCompare(b),
//   ),
// );

export default objectSortByKeysMatching;
