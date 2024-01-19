/**
 * Remove duplicated array objects, equality is determined by a strict (`===`)
 * comparison of each object's given key
 *
 * @category array
 */
export function removeDuplicatesByKey<
  T extends Record<string | number | symbol, any>,
>(array: T[] = [] as T[], key: keyof T) {
  const keysMap = {} as Record<T[keyof T], boolean>;
  const output: T[] = [];

  for (let i = 0; i < array.length; i++) {
    const item = array[i];
    if (!keysMap[item[key]]) {
      output.push(item);
      keysMap[item[key]] = true;
    }
  }

  return output;
}

export default removeDuplicatesByKey;
