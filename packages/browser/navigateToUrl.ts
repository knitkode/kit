/**
 * It updates the browser's location URL with global `history` object
 *
 * @category location
 */
export let navigateToUrl = (url = "", replace?: boolean) => {
  if (url) {
    history[replace ? "replaceState" : "pushState"](history.state, "", url);
  }
};

export default navigateToUrl;
