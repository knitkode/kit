export type I18nLocale = string & {
    branded: true;
};
export type I18nIndexedFile = {
    path: string;
    locale: I18nLocale;
    data: {
        [key: string]: any;
    };
};
export type I18nIndexedLocale = {
    path: string;
    code: I18nLocale;
};
