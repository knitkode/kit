import { isBrowser } from "./isBrowser";

/**
 * @category ssr
 * @category is
 */
export let isServer = !isBrowser;
// export let isServer = typeof window === "undefined";
