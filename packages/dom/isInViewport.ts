/**
 * Determine if an element is in the viewport
 *
 * @borrows (c) 2017 Chris Ferdinandi, MIT License, https://gomakethings.com
 *
 * @param elem The element
 * @return Returns true if element is in the viewport
 */
export let isInViewport = <T extends Element>(elem: T) => {
  const distance = elem.getBoundingClientRect();
  return (
    distance.top >= 0 &&
    distance.left >= 0 &&
    distance.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    distance.right <=
      (window.innerWidth || document.documentElement.clientWidth)
  );
};
