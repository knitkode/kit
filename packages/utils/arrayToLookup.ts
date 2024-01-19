/**
 * Maps a simple flat array to a lookup dictionary object
 *
 * @category array
 */
export function arrayToLookup<T extends string | number | symbol>(
  array: T[] = [] as T[],
) {
  return array.reduce(
    (obj, item) => {
      obj[item] = 1;
      return obj;
    },
    {} as Record<T, 1>,
  );
}

export default arrayToLookup;
