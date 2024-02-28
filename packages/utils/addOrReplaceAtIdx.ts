/**
 * Add or replace an item in the given array, it returns a new array (immutable).
 * Typescript wise this is meant to keep the same type on the newly returned
 * array, therefore the `newItem` must match the type of the `list` items.
 *
 * @category array
 */
export let addOrReplaceAtIdx = <T>(
  list: T[],
  newItem: T,
  newIdx?: number,
): T[] => {
  if (list.length === 0) {
    return [newItem];
  }

  if (typeof newIdx === "undefined" || list.length - 1 < newIdx) {
    return [...list, newItem];
  }

  return list.map((item, idx) => {
    if (idx === newIdx) {
      return newItem;
    }
    return item;
  });
};

export default addOrReplaceAtIdx;
