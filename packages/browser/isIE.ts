import { isServer } from "@koine/utils";

/**
 * @category detect
 * @category is
 * @see https://stackoverflow.com/a/21712356/12285349
 */
export let isIE = (ssrValue = true) => {
  if (isServer) {
    return ssrValue;
  }
  const ua = window.navigator.userAgent;

  if (ua.indexOf("MSIE ") > 0 || ua.indexOf("Trident/") > 0) {
    return true;
  }
  return false;
};
