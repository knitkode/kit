/**
 * Remove duplicated array objects, equality is determined by a strict (`===`)
 * comparison of each object's given key (as in a `Set`, `NaN` values are
 * considered equal to each other)
 *
 * @category array
 */
export let removeDuplicatesByKey = <
  T extends Record<string | number | symbol, any>,
>(
  array: T[] = [] as T[],
  key: keyof T,
) => {
  const seen = new Set();
  return array.filter((item) => !seen.has(item[key]) && seen.add(item[key]));
};

export default removeDuplicatesByKey;
