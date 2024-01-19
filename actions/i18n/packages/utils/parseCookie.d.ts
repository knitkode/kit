import { type CookieAttributesServer } from "./cookie";
export declare function parseCookie<T extends Record<string, unknown> = Record<string, string>>(str: string, attributes?: CookieAttributesServer): T;
export default parseCookie;
