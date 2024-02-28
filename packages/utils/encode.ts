/**
 * @category security
 * @see https://stackoverflow.com/a/22405578/9122820
 */
export let encode = <TReturn extends string>(str: string) =>
  str.replace(/./g, (c) => ("00" + c.charCodeAt(0)).slice(-3)) as TReturn;

export default encode;
