export declare function parseURL(url: string): {
    href: string;
    protocol: string;
    host: string;
    hostname: string;
    port: string;
    pathname: string;
    search: string;
    hash: string;
} | null;
export default parseURL;
