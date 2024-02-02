/**
 * Get element height
 */
export let getHeight = <T extends Element>(element: T) =>
  parseInt(window.getComputedStyle(element).height, 10);
