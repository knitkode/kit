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
 * RegExp to match cookie-name in RFC 6265 sec 4.1.1
 * This refers out to the obsoleted definition of token in RFC 2616 sec 2.2
 * which has been replaced by the token definition in RFC 7230 appendix B.
 *
 * cookie-name       = token
 * token             = 1*tchar
 * tchar             = "!" / "#" / "$" / "%" / "&" / "'" /
 *                     "*" / "+" / "-" / "." / "^" / "_" /
 *                     "`" / "|" / "~" / DIGIT / ALPHA
 */
const cookieNameRegExp = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;

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
 * RegExp to match domain-value in RFC 6265 sec 4.1.1
 *
 * domain-value      = <subdomain>
 *                     ; defined in [RFC1034], Section 3.5, as
 *                     ; enhanced by [RFC1123], Section 2.1
 * <subdomain>       = <label> | <subdomain> "." <label>
 * <label>           = <let-dig> [ [ <ldh-str> ] <let-dig> ]
 *                     Labels must be 63 characters or less.
 *                     'let-dig' not 'letter' in the first char, per RFC1123
 * <ldh-str>         = <let-dig-hyp> | <let-dig-hyp> <ldh-str>
 * <let-dig-hyp>     = <let-dig> | "-"
 * <let-dig>         = <letter> | <digit>
 * <letter>          = any one of the 52 alphabetic characters A through Z in
 *                     upper case and a through z in lower case
 * <digit>           = any one of the ten digits 0 through 9
 *
 * Keep support for leading dot: https://github.com/jshttp/cookie/issues/173
 *
 * > (Note that a leading %x2E ("."), if present, is ignored even though that
 * character is not permitted, but a trailing %x2E ("."), if present, will
 * cause the user agent to ignore the attribute.)
 */
const domainValueRegExp =
  /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i;

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
    if (!cookieNameRegExp.test(name)) {
      throw new TypeError("argument name is invalid");
    }
    if (typeof encode !== "function") {
      throw new TypeError("option encode is invalid");
    }
    if (value && !fieldContentRegExp.test(value)) {
      throw new TypeError("argument val is invalid");
    }
  }

  let str = name + "=" + value;

  if (null != maxAge) {
    maxAge = maxAge - 0;

    if (process.env["NODE_ENV"] === "development") {
      if (isNaN(maxAge) || !isFinite(maxAge)) {
        throw new TypeError("option maxAge is invalid");
      }
    }

    str += "; Max-Age=" + Math.floor(maxAge);
  }

  if (domain) {
    if (process.env["NODE_ENV"] === "development") {
      if (!domainValueRegExp.test(domain)) {
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

export default serializeCookie;
