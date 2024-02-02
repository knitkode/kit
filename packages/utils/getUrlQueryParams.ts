import { isBrowser } from "./isBrowser";
import type { AnyQueryParams } from "./location";

/**
 * Get parsed query parameters as object dictionary (from URL or given query string)
 *
 * @category location
 * @param url A URL which contains a  `?`, e.g. `?myparam=x` or `https://a.com?myparams=x`.
 * If not provided it defaults reading the current URL query string with
 * `location.search`. Through this argument you can use this same function to
 * parse, for instance, the query params of the `href` of a `<a href="...">` HTML tag.
 *
 */
export let getUrlQueryParams = <T extends NonNullable<AnyQueryParams>>(
  url?: string,
) => {
  let params = {};
  const search = url
    ? url.split("?")?.[1]
    : isBrowser
      ? location.search.substring(1)
      : "";

  if (!search) {
    return {} as T;
  }

  try {
    // @see https://stackoverflow.com/a/8649003/1938970
    const paramsAsObj = `{"${search
      .replace(/&/g, '","')
      .replace(/=/g, '":"')}"}`;
    params = JSON.parse(paramsAsObj, (key, value) =>
      key === "" ? value : decodeURIComponent(value),
    );
  } catch (e) {
    // do nothing or warn on process.env["NODE_ENV"] === "development"
  }

  return params as T;
};
