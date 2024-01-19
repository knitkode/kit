import type { I18nIndexedFile } from "./types";
export declare function generateTypes(options: {
    defaultLocale: string;
    files: I18nIndexedFile[];
}): Promise<string>;
