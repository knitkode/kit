import { type CookieAttributesServer } from "./cookie";

/**
 * Try decoding a string using a decoding function.
 */
function tryDecode(str: string, decode: (input: string) => string) {
  try {
    return decode(str);
  } catch (e) {
    return str;
  }
}

/**
 * Parse a cookie header.
 *
 * Parse the given cookie header string into an object
 * The object has the various cookies as keys(names) => values
 *
 * @category cookie
 */
export function parseCookie<
  T extends Record<string, unknown> = Record<string, string>,
>(str: string, attributes: CookieAttributesServer = {}) {
  if (typeof str !== "string") {
    throw new TypeError("argument str must be a string");
  }

  const obj = {} as T;
  const pairs = str.split(";");
  const { decode = decodeURIComponent } = attributes;

  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i];
    const index = pair.indexOf("=");

    // skip things that don't look like key=value
    if (index < 0) {
      continue;
    }

    const key = pair.substring(0, index).trim() as keyof T;

    // only assign once
    if (undefined == obj[key]) {
      let val = pair.substring(index + 1, pair.length).trim();

      // quoted values
      if (val[0] === '"') {
        val = val.slice(1, -1);
      }

      obj[key] = tryDecode(val, decode) as T[keyof T];
    }
  }

  return obj;
}

export default parseCookie;
