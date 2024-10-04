/**
 * @borrows [SO answer](https://stackoverflow.com/a/56757215/1938970)
 *
 * @category array
 * @param array The array to filter
 * @param keys The keys to compare in each array item
 * @returns The filtered array
 */
export const arrayUniqueByProperties = <T>(
  array: T[],
  keys: (keyof T)[],
): T[] => {
  const seen = new Set<string>();

  return array.filter((item) => {
    // Create a unique key based on the specified properties
    const key = keys.map(k => item[k]).join('|');
    if (seen.has(key)) {
      return false; // Already seen, so filter out
    }
    seen.add(key); // Add to the seen set
    return true; // Keep this item
  });
};

export default arrayUniqueByProperties;
