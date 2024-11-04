/**
 * Get the background color of an element eventually looking recursively into
 * its parents, if nothing is found it returns a `#fff` background
 */
export let getVisualBackgroundColor = (elem?: null | Element): string => {
  if (!elem) return "#fff";

  const transparent = "rgba(0, 0, 0, 0)";
  const transparentIE11 = "transparent";
  // if (!elem) return transparent;

  const bg = window.getComputedStyle(elem).backgroundColor;

  if (!bg || (bg === transparent || bg === transparentIE11)) {
    const parent = elem.parentElement;
    if (parent) {
      return getVisualBackgroundColor(parent);
    }
    return "#fff";
  }

  return bg;
};

export default getVisualBackgroundColor;
