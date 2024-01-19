export declare function writeTypes(options: {
    cwd: string;
    defaultLocale: string;
    outputTypes: string;
}): Promise<{
    locales: import("./types").I18nIndexedLocale[];
    files: import("./types").I18nIndexedFile[];
}>;
