/**
 * Get scrollbar's current width
 */
export let getScrollbarWidth = <T extends HTMLElement>(element?: T) =>
  window.innerWidth - (element || document.documentElement).clientWidth;

export default getScrollbarWidth;
