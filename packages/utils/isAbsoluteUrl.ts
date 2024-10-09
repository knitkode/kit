let reg = /^[a-zA-Z][a-zA-Z\d+\-.]*?:/;
// let reg = /^[a-zA-Z][a-zA-Z\d+\-.]*?:(\/{2}\S+|(?!\/+)\S+)/;
// let reg = /^(?:[a-z+]+:)?\/\//i;

/**
 * @borrows [next.js source code](https://github.com/vercel/next.js/blob/canary/packages/next/src/shared/lib/utils.ts#L322-L325)
 * @borrows [SO's answer](https://stackoverflow.com/a/19709846/1938970)
 *
 * @see Scheme: https://tools.ietf.org/html/rfc3986#section-3.1
 * @see Absolute URL: https://tools.ietf.org/html/rfc3986#section-4.3
 *
 * @category is
 */
export let isAbsoluteUrl = (url: string) => reg.test(url);

export default isAbsoluteUrl;
