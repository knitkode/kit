/**
 * Move item from one place to another in a sortable array of objects, re-ordering
 * the array accrodingly (no swapping of position).
 * This is useful for drag and drop functionalities
 *
 * @category array
 */
export function moveSortableArrayItemByKey<T, K extends keyof T>(
  items: T[],
  key: K,
  fromItem: Pick<T, K>,
  toItem: Pick<T, K>,
) {
  const itemsKeys = items.map((item) => item[key]);
  const idxFrom = itemsKeys.indexOf(fromItem[key]);
  const idxTo = itemsKeys.indexOf(toItem[key]);

  const [item] = items.splice(idxFrom, 1);
  items.splice(idxTo, 0, item);
  return [...items];
}

export default moveSortableArrayItemByKey;
