/**
 * Decode a string encoded with `encode`.
 *
 * Characters that are not part of an encoded sequence are kept as they are,
 * e.g. the raw line breaks that `encode` used to leave in its output.
 *
 * @category security
 * @see https://stackoverflow.com/a/22405578/9122820
 */
export let decode = <TReturn extends string>(str: string) =>
  str.replace(/u(\d{7})|(\d{3})/g, (_match, long?: string, short?: string) =>
    String.fromCodePoint(parseInt(long ?? short ?? "", 10)),
  ) as TReturn;

export default decode;
