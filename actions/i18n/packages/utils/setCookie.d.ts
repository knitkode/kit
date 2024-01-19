import { type CookieAttributesClient } from "./cookie";
export declare function setCookie<T extends string = string>(name: string, value: string | T, attributes?: CookieAttributesClient): string | undefined;
export default setCookie;
