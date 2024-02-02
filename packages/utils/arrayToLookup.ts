/**
 * Maps a simple flat array to a lookup dictionary object
 *
 * @category array
 */
export let arrayToLookup = <T extends string | number | symbol>(
  array: T[] = [] as T[],
) =>
  array.reduce(
    (obj, item) => {
      obj[item] = 1;
      return obj;
    },
    {} as Record<T, 1>,
  );
