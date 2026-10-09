import { isBrowser } from "./isBrowser";

/**
 * Is external url compared to the given current URL (if not provided it falls
 * back to `location.href`)
 *
 * @category location
 *
 */
export let isExternalUrl = (url: string, currentUrl?: string) => {
  // the host (without port) of an absolute http(s) URL, `localhost` included
  const reg = /^https?:\/\/((?:[\w-]+\.)*[\w-]+)(?::\d+)?(?:[/?#]|$)/i;
  const urlMatches = reg.exec(url);

  // if no matches are found it means we either have an invalid URL, a relative
  // URL or a hash link, and those are not considered externals
  if (!urlMatches) {
    return false;
  }

  const base = currentUrl || (isBrowser ? location.href : "");
  const baseHost = base ? reg.exec(base)?.[1] : undefined;

  return baseHost
    ? baseHost.toLowerCase() !== urlMatches[1].toLowerCase()
    : true;
};

export default isExternalUrl;
