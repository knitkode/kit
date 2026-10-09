/**
 * @category ssr
 * @category is
 */
export let isServerNow = () => typeof window === "undefined";

export default isServerNow;
