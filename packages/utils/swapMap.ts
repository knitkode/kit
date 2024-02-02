/**
 * Swap object map key/value
 *
 * @category object
 */
export let swapMap = <
  T extends Record<string, string | number | symbol> = Record<
    string,
    string | number | symbol
  >,
>(
  map = {} as T,
) => {
  const output = {} as Record<T[keyof T], keyof T>;
  for (const key in map) {
    output[map[key]] = key;
  }
  return output;
};
