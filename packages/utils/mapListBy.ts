/**
 * Maps an array of objects into a map keyed with the given key
 *
 * @category array
 */
export let mapListBy = <T extends Record<string | number | symbol, any>>(
  array: T[] = [] as T[],
  key: keyof T = "" as keyof T,
) =>
  array.reduce(
    (obj, item) => {
      obj[item[key]] = item;
      return obj;
    },
    {} as Record<T[keyof T], T>,
  );
