import { type CookieAttributesClient, defaultAttributesClient } from "./cookie";
import { setCookie } from "./setCookie";

/**
 * @category cookie
 */
export function removeCookie(
  name: string,
  attributes: CookieAttributesClient = {},
) {
  setCookie(name, "", {
    ...defaultAttributesClient,
    ...attributes,
    expires: -1,
  });
}

export default removeCookie;
