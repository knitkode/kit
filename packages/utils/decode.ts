/**
 * @category security
 * @see https://stackoverflow.com/a/22405578/9122820
 */
export let decode = <TReturn extends string>(str: string) =>
  str.replace(/.{3}/g, (c) => String.fromCharCode(parseInt(c, 10))) as TReturn;
