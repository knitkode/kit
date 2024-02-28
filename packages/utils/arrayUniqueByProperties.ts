/**
 * @borrows [SO answer](https://stackoverflow.com/a/56757215/1938970)
 *
 * @category array
 * @param array The array to filter
 * @param keys The keys to compare in each array item
 * @returns The filtered array
 */
export let arrayUniqueByProperties = <T extends any[]>(
  array: T,
  keys: (keyof T[number])[],
) =>
  array.filter(
    (item, idx, arr) =>
      arr.findIndex((itemWith) =>
        keys.every((k) => itemWith[k] === item[k]),
      ) === idx,
  ) as T;

export default arrayUniqueByProperties;
