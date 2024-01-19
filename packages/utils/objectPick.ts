/**
 * Pick object properties by selecting only the given keys, it returns a
 * new object.
 *
 * @category object
 */
export function objectPick<T extends object, Keys extends (keyof T)[]>(
  object: T,
  keys: Keys,
) {
  const output = {} as Partial<T>;
  let len = keys.length;
  while (len--) {
    output[keys[len]] = object[keys[len]];
  }

  return output as Pick<T, Keys[number]>;
}

export default objectPick;
