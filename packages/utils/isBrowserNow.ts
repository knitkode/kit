import { isUndefined } from "./isUndefined";

/**
 * @category ssr
 * @category is
 */
export let isBrowserNow = () => !isUndefined(window);
