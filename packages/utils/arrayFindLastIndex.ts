/**
 * Returns the index of the last element in the array where predicate is true, and -1
 * otherwise.
 *
 * @borrows [SO's answer by Nico Timmerman](https://stackoverflow.com/a/53187807/1938970)
 *
 * @category array
 *
 * @param array The source array to search in
 * @param predicate find calls predicate once for each element of the array, in descending
 * order, until it finds one where predicate returns true. If such an element is found,
 * findLastIndex immediately returns that element index. Otherwise, findLastIndex returns -1.
 */
export let arrayFindLastIndex = <T>(
  array: Array<T>,
  predicate: (value: T, index: number, obj: T[]) => boolean,
): number => {
  let l = array.length;
  while (l--) {
    if (predicate(array[l], l, array)) return l;
  }
  return -1;
};

export default arrayFindLastIndex;
