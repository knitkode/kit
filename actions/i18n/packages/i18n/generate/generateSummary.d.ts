import type { I18nIndexedFile } from "./types";
export type I18nGenerateSummaryConfig = {
    defaultLocale: string;
    sourceUrl: string;
};
type Locale = string & {
    branded: true;
};
type I18nGenerateSummaryOptions = I18nGenerateSummaryConfig & {
    files: I18nIndexedFile[];
};
type I18nSummary = Record<Locale, {
    words: number;
    characters: number;
    files: I18nSummaryFile[];
}>;
type I18nSummaryFile = {
    locale: Locale;
    path: string;
    url: string;
    words: number;
    characters: number;
};
export declare function generateSummary(options: I18nGenerateSummaryOptions): Promise<{
    data: I18nSummary;
    md: string;
}>;
export {};
