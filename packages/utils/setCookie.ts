import { type CookieAttributesClient, defaultAttributesClient } from "./cookie";
import { isNumber } from "./isNumber";
import { isUndefined } from "./isUndefined";

let converterWrite = (value: string) => {
  return encodeURIComponent(value).replace(
    /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
    decodeURIComponent,
  );
};

/**
 * @category cookie
 */
export let setCookie = <T extends string = string>(
  name: string,
  value: string | T,
  attributes: CookieAttributesClient = {},
): string | undefined => {
  // eslint-disable-next-line prefer-const
  let { expires, ...restAttrs } = attributes;
  const cleanedAttrs = {
    expires: "",
    ...defaultAttributesClient,
    ...restAttrs,
  };

  if (isUndefined(document)) {
    if (process.env["NODE_ENV"] === "development") {
      console.warn("[@koine/utils:setCookie] document is undefined");
    }
    return undefined;
  }

  if (isNumber(expires)) {
    expires = new Date(Date.now() + expires * 864e5);
  }
  if (expires) {
    cleanedAttrs.expires = expires.toUTCString();
  }

  name = encodeURIComponent(name)
    .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
    .replace(/[()]/g, escape);

  let stringifiedAttributes = "";
  for (const name in attributes) {
    const attrName = name as keyof CookieAttributesClient;
    if (!attributes[attrName]) {
      continue;
    }

    stringifiedAttributes += "; " + attrName;

    if (attributes[attrName] === true) {
      continue;
    }

    // Considers RFC 6265 section 5.2:
    // ...
    // 3.  If the remaining unparsed-attributes contains a %x3B (";")
    //     character:
    // Consume the characters of the unparsed-attributes up to,
    // not including, the first %x3B (";") character.
    // ...
    stringifiedAttributes +=
      "=" + (String(attributes[attrName]) as string).split(";")[0];
  }

  return (document.cookie =
    name + "=" + converterWrite(value) + stringifiedAttributes);
};

export default setCookie;
