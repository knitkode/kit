/**
 * Is node list
 *
 * @param nodes The object to check
 */
export let isNodeList = (nodes: any): nodes is NodeList => {
  const stringRepr = Object.prototype.toString.call(nodes);

  return (
    typeof nodes === "object" &&
    /^\[object (HTMLCollection|NodeList|Object)\]$/.test(stringRepr) &&
    typeof nodes.length === "number" &&
    (nodes.length === 0 ||
      (typeof nodes[0] === "object" && nodes[0].nodeType > 0))
  );
};

export default isNodeList;
