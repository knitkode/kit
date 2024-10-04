/**
 * Add or replace an item in the given array, it returns a new array (immutable).
 * Typescript wise this is meant to keep the same type on the newly returned
 * array, therefore the `newItem` must match the type of the `list` items.
 *
 * @category array
 * @param list The original array to modify.
 * @param newItem The item to add or replace.
 * @param newIdx The index at which to replace the item (if defined).
 * @returns A new array with the item added or replaced.
 */
export let addOrReplaceAtIdx = <T>(
  list: T[],
  newItem: T,
  newIdx?: number,
): T[] => {
  if (newIdx !== undefined && newIdx >= 0 && newIdx < list.length) {
    return [
      ...list.slice(0, newIdx),  // Items before the index
      newItem,                   // New item
      ...list.slice(newIdx + 1), // Items after the index
    ];
  }

  return [...list, newItem]; // Add to the end if newIdx is not valid
};

export default addOrReplaceAtIdx;
