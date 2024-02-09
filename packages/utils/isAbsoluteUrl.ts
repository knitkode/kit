let reg = /^(?:[a-z+]+:)?\/\//i;

/**
 * @borrows [SO's answer](https://stackoverflow.com/a/19709846/1938970)
 *
 * @category is
 */
export let isAbsoluteUrl = (url: string) => reg.test(url);
