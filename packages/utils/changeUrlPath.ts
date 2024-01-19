import isBrowser from "./isBrowser";
import normaliseUrlPathname from "./normaliseUrlPathname";

/**
 * Change URL path, ensures initial and ending slashes and normalise eventual
 * consecutive slashes, it uses `history`.
 *
 * @category location
 * @param replace Replace URL instead of pushing it in the history stack. By default it pushes it.
 * @returns {string} The new cleaned pathname
 */
export function changeUrlPath(
  pathname: string,
  state?: object,
  replace?: boolean,
) {
  const path = normaliseUrlPathname(`/${pathname}/`);

  if (isBrowser) {
    history[replace ? "replaceState" : "pushState"](state, "", path);
  }

  return path;
}

export default changeUrlPath;
