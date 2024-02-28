/**
 * @module
 *
 * @category cookie
 *
 * All cookie related code is inspired and adapted from:
 * - [js-cookie](https://github.com/js-cookie/js-cookie)
 * - [cookie](https://github.com/jshttp/cookie)
 */

/**
 * @category cookie
 */
type CookieAttributes = {
  /**
   * Define when the cookie will be removed. Value can be a Number
   * which will be interpreted as days from time of creation or a
   * Date instance. If omitted, the cookie becomes a session cookie.
   */
  expires?: number | Date | undefined;

  /**
   * Define the path where the cookie is available. Defaults to '/'
   *
   * @default "/"
   */
  path?: string | undefined;

  /**
   * Define the domain where the cookie is available. Defaults to
   * the domain of the page where the cookie was created.
   */
  domain?: string | undefined;

  /**
   * A Boolean indicating if the cookie transmission requires a
   * secure protocol (https).
   *
   * @default "true"
   */
  secure?: boolean | undefined;

  /**
   * Asserts that a cookie must not be sent with cross-origin requests,
   * providing some protection against cross-site request forgery
   * attacks (CSRF)
   *
   * @default "strict"
   */
  sameSite?: "strict" | "Strict" | "lax" | "Lax" | "none" | "None" | undefined;

  /**
   * An attribute which will be serialized, conformably to RFC 6265
   * section 5.2.
   */
  // [property: string]: any;
};

/**
 * @category cookie
 */
export type CookieAttributesServer = CookieAttributes & {
  maxAge?: number;
  httpOnly?: boolean;
  encode?: (input: string) => string;
  decode?: (input: string) => string;
};

/**
 * @category cookie
 */
export type CookieAttributesClient = CookieAttributes;

/**
 * @category cookie
 * @internal
 */
export let defaultAttributesClient = { path: "/" };
