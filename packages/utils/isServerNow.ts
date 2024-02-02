import { isUndefined } from "./isUndefined";

/**
 * @category ssr
 * @category is
 */
export let isServerNow = () => isUndefined(window);
