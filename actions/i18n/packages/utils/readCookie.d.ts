export declare function readCookie<T extends Record<string, unknown> = Record<string, string>>(name?: null): T;
export declare function readCookie<T extends Record<string, unknown> = Record<string, string>, N extends keyof T = keyof T>(name: N): T[N];
export default readCookie;
