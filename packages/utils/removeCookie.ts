import type { CookieAttributesClient } from "./cookie";
import { setCookie } from "./setCookie";

/**
 * Remove a cookie by expiring it, pass the same `path` and `domain` used to set
 * it (`setCookie` defaults the `path` to `/`)
 *
 * @category cookie
 */
export let removeCookie = (
  name: string,
  attributes: CookieAttributesClient = {},
) => {
  setCookie(name, "", { ...attributes, expires: -1 });
};

export default removeCookie;
