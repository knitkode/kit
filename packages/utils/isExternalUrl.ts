import { isBrowser } from "./isBrowser";

/**
 * Is external url compared to the given current URL (if not provided it falls
 * back to `location.href`)
 *
 * @category location
 *
 */
export let isExternalUrl = (url: string, currentUrl?: string) => {
  const reg = /https?:\/\/((?:[\w\d-]+\.)+[\w\d]{2,})/i;
  const urlMatches = reg.exec(url);

  // if no matches are found it means we either have an invalid URL, a relative
  // URL or a hash link, and those are not considered externals
  if (!urlMatches) {
    return false;
  }

  currentUrl = currentUrl || isBrowser ? location.href : "";

  return currentUrl ? reg.exec(currentUrl)?.[1] !== urlMatches[1] : true;
};
