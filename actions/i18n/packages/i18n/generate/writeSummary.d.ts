import { type I18nGenerateSummaryConfig } from "./generateSummary";
export declare function writeSummary(options: {
    cwd: string;
    outputJson: string;
    outputMarkdown: string;
} & I18nGenerateSummaryConfig): Promise<{
    locales: import("./types").I18nIndexedLocale[];
    files: import("./types").I18nIndexedFile[];
}>;
