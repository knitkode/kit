/**
 * Creates an array of shuffled values, using a version of the
 * [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher-Yates_shuffle).
 *
 * @category array
 * @borrows [lodash.shuffle](https://github.com/lodash/lodash/blob/master/shuffle.js)
 * @example
 * ```ts
 * shuffle([1, 2, 3, 4])
 * // => [4, 1, 3, 2]
 * ```
 *
 * @param array The array to shuffle.
 * @returns The new shuffled array.
 */
export let shuffle = <T>(array: T[]) => {
  const length = array == null ? 0 : array.length;
  if (!length) {
    return [];
  }
  let index = -1;
  const lastIndex = length - 1;
  const result = [...array] as T[];
  while (++index < length) {
    const rand = index + Math.floor(Math.random() * (lastIndex - index + 1));
    const value = result[rand];
    result[rand] = result[index];
    result[index] = value;
  }
  return result;
};

export default shuffle;
