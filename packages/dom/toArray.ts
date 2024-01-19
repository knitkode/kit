/**
 * Node list to array
 *
 * @param nodeList
 */
export function toArray<T extends Element = HTMLElement>(
  nodeList: NodeListOf<T> | HTMLFormControlsCollection,
) {
  return Array.prototype.slice.call(nodeList) as T[] | HTMLFormElement[];
}

export default toArray;
