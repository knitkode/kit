import { type CookieAttributesClient, defaultAttributesClient } from "./cookie";
import { setCookie } from "./setCookie";

/**
 * @category cookie
 */
export let removeCookie = (
  name: string,
  attributes: CookieAttributesClient = {},
) => {
  setCookie(name, "", {
    ...defaultAttributesClient,
    ...attributes,
    expires: -1,
  });
};
