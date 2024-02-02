/**
 * @module
 *
 * @category cookie
 *
 * All cookie related code is inspired and adapted from:
 * - [js-cookie](https://github.com/js-cookie/js-cookie)
 * - [cookie](https://github.com/jshttp/cookie)
 */
import type { CookieAttributesServer } from "./cookie";
import { isNumber } from "./isNumber";

/**
 * RegExp to match field-content in RFC 7230 sec 3.2
 *
 * field-content = field-vchar [ 1*( SP / HTAB ) field-vchar ]
 * field-vchar   = VCHAR / obs-text
 * obs-text      = %x80-FF
 */
// eslint-disable-next-line no-control-regex
const fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;

/**
 * Serialize data into a cookie header.
 *
 * Serialize the a name value pair into a cookie string suitable for
 * http headers. An optional attributes object specified cookie parameters.
 *
 * serialize('foo', 'bar', { httpOnly: true })
 *   => "foo=bar; httpOnly"
 *
 * @category cookie
 */
export let serializeCookie = (
  name: string,
  val: string,
  attributes: CookieAttributesServer = {},
) => {
  const {
    encode = encodeURIComponent,
    domain,
    path,
    httpOnly,
    secure,
    sameSite,
  } = attributes;
  let { maxAge, expires } = attributes;

  const value = encode(val);

  if (process.env["NODE_ENV"] === "development") {
    if (!fieldContentRegExp.test(name)) {
      throw new TypeError("argument name is invalid");
    }
    if (typeof attributes.encode !== "function") {
      throw new TypeError("option encode is invalid");
    }
    if (value && !fieldContentRegExp.test(value)) {
      throw new TypeError("argument val is invalid");
    }
  }

  let str = name + "=" + value;

  if (null != maxAge) {
    maxAge = maxAge - 0;

    if (isNaN(maxAge) || !isFinite(maxAge)) {
      throw new TypeError("option maxAge is invalid");
    }

    str += "; Max-Age=" + Math.floor(maxAge);
  }

  if (domain) {
    if (process.env["NODE_ENV"] === "development") {
      if (!fieldContentRegExp.test(domain)) {
        throw new TypeError("option domain is invalid");
      }
    }

    str += "; Domain=" + domain;
  }

  if (path) {
    if (process.env["NODE_ENV"] === "development") {
      if (!fieldContentRegExp.test(path)) {
        throw new TypeError("option path is invalid");
      }
    }

    str += "; Path=" + path;
  }

  if (expires) {
    if (isNumber(expires)) {
      expires = new Date(Date.now() + expires * 864e5);
    }

    str += "; Expires=" + expires.toUTCString();
  }

  if (httpOnly) {
    str += "; HttpOnly";
  }

  if (secure) {
    str += "; Secure";
  }

  if (sameSite) {
    switch (sameSite.toLowerCase()) {
      case "lax":
        str += "; SameSite=Lax";
        break;
      case "strict":
        str += "; SameSite=Strict";
        break;
      case "none":
        str += "; SameSite=None";
        break;
      //  default:
      //    throw new TypeError('option sameSite is invalid');
    }
  }

  return str;
};
