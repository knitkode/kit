type CookieAttributes = {
    expires?: number | Date | undefined;
    path?: string | undefined;
    domain?: string | undefined;
    secure?: boolean | undefined;
    sameSite?: "strict" | "Strict" | "lax" | "Lax" | "none" | "None" | undefined;
};
export type CookieAttributesServer = CookieAttributes & {
    maxAge?: number;
    httpOnly?: boolean;
    encode?: (input: string) => string;
    decode?: (input: string) => string;
};
export type CookieAttributesClient = CookieAttributes;
export declare const defaultAttributesClient: {
    path: string;
};
export {};
