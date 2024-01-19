import type { I18nIndexedFile, I18nIndexedLocale } from "./types";
type I18nGetFsDataOutput = {
    locales: I18nIndexedLocale[];
    files: I18nIndexedFile[];
};
export declare function getFsData(options: {
    cwd: string;
    onlyFilesForLocales?: string[];
}): Promise<I18nGetFsDataOutput>;
export {};
