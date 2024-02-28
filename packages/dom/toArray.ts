/**
 * Node list to array
 *
 * @param nodeList
 */
export let toArray = <T extends Element>(
  nodeList: NodeListOf<T> | HTMLFormControlsCollection,
) => Array.prototype.slice.call(nodeList) as T[] | HTMLFormElement[];

export default toArray;
