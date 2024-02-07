export const id = 301;
export const ids = [301];
export const modules = {

/***/ 58:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = (function () { return "\n\"use client\";\n\nimport _DynamicNamespaces from \"next-translate/DynamicNamespaces\";\n\nexport const DynamicNamespaces = _DynamicNamespaces;\n\nexport default DynamicNamespaces;\n"; });


/***/ }),

/***/ 1094:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = (function () { return "\n\"use client\";\n\nimport type { TransProps } from \"next-translate\";\nimport Trans from \"next-translate/Trans\";\nimport type { I18n } from \"./types\";\n\nexport type TProps<\n  TNamespace extends I18n.TranslateNamespace | undefined = undefined,\n> =\n  | (Omit<TransProps, \"i18nKey\" | \"ns\"> & {\n      i18nKey: I18n.TranslationsAllPaths;\n    })\n  | (Omit<TransProps, \"i18nKey\" | \"ns\"> & {\n      ns: TNamespace;\n      i18nKey: I18n.TranslationsPaths<TNamespace>;\n    });\n\nconst TypedT = <\n  TNamespace extends I18n.TranslateNamespace | undefined = undefined,\n>(\n  props: TProps<TNamespace>,\n) =>\n  (<Trans {...(props as TransProps)} />) as React.ReactElement<\n    TProps<TNamespace>\n  >;\n\nexport const T = Trans as typeof TypedT;\n\nexport default T;\n"; });


/***/ }),

/***/ 1012:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = (function () { return "\n\"use client\";\n\nimport _TransText from \"next-translate/TransText\";\n\nexport const TransText = _TransText;\n\nexport default TransText;\n"; });


/***/ }),

/***/ 234:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = (function () { return "\nimport _getT from \"next-translate/getT\";\nimport type { I18n } from \"./types\";\n\nexport type GetT = <\n  TNamespace extends I18n.TranslateNamespace | undefined = undefined,\n>(\n  locale?: I18n.Locale,\n  namespace?: TNamespace,\n) => Promise<I18n.Translate<TNamespace>>;\n\nexport const getT = _getT as GetT;\n\nexport default getT;\n"; });


/***/ }),

/***/ 4301:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(5331);
var DynamicNamespaces_1 = tslib_1.__importDefault(__webpack_require__(58));
var T_1 = tslib_1.__importDefault(__webpack_require__(1094));
var TransText_1 = tslib_1.__importDefault(__webpack_require__(1012));
var getT_1 = tslib_1.__importDefault(__webpack_require__(234));
var nextTranslateI18n_1 = tslib_1.__importDefault(__webpack_require__(7742));
var useT_1 = tslib_1.__importDefault(__webpack_require__(6050));
var adapter = function () {
    return {
        dependsOn: ["next"],
        files: [
            {
                name: "DynamicNamespaces",
                fn: DynamicNamespaces_1.default,
                ext: "tsx",
                index: true,
            },
            { name: "getT", fn: getT_1.default, ext: "ts", index: true },
            { name: "nextTranslateI18n", fn: nextTranslateI18n_1.default, ext: "js" },
            { name: "T", fn: T_1.default, ext: "tsx", index: true },
            { name: "TransText", fn: TransText_1.default, ext: "tsx", index: true },
            { name: "useT", fn: useT_1.default, ext: "ts", index: true },
        ],
    };
};
exports["default"] = adapter;


/***/ }),

/***/ 7742:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = (function (_a) {
    var config = _a.config;
    return "\n/**\n * Get 'next-translate' configuration\n *\n * @see https://github.com/vinissimus/next-translate#how-are-translations-loaded\n * \n * @param {Omit<Partial<import(\"next-translate\").I18nConfig>, \"pages\"> & { pages: Record<string, import(\"./types\").I18n.TranslateNamespace[]> }} config\n */\nmodule.exports = (config = { pages: {} }) => {\n  return {\n    locales: [".concat(config.locales.map(function (l) { return "\"".concat(l, "\""); }).join(", "), "],\n    defaultLocale: \"").concat(config.defaultLocale, "\",\n    logBuild: false,\n    // logger: () => void 0,\n    loadLocaleFrom: (locale, namespace) => import(`./translations/${locale}/${namespace}.json`).then((m) => m.default),\n    ...config,\n  };\n}\n");
});


/***/ }),

/***/ 6050:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = (function () { return "\n\"use client\";\n\nimport { useMemo } from \"react\";\nimport useTranslation from \"next-translate/useTranslation\";\nimport type { I18n } from \"./types\";\n\n/**\n * Wrap next-translate useTranslations for type safety and adds TranslationShortcut\n * as second/thir argument.\n *\n * @see https://github.com/vinissimus/next-translate/issues/513#issuecomment-779826418\n *\n * About the typescript support for translation strings see:\n * - https://github.com/vinissimus/next-translate/issues/721\n */\nexport const useT = <TNamespace extends I18n.TranslateNamespace>(namespace: TNamespace) => {\n  const t = useTranslation().t;\n  const tMemoized = useMemo(\n    () =>\n      function <\n        TPath extends I18n.TranslationsPaths<I18n.TranslationsDictionary[TNamespace]>,\n        TReturn = I18n.TranslationAtPathFromNamespace<TNamespace, TPath>,\n      >(s: TPath, q?: I18n.TranslationQuery, o?: I18n.TranslationOptions): TReturn {\n        return t(\n          (namespace ? namespace + \":\" + s : s) as string,\n          q === \"obj\" || q === \"\" ? null : q,\n          q === \"obj\" || o === \"obj\"\n            ? { returnObjects: true }\n            : q === \"\" || o === \"\"\n              ? { fallback: \"\" }\n              : o,\n        ) as TReturn;\n        // ) as TReturn extends (undefined | never | unknown) ? TranslateReturn<I18n.TranslationQuery, I18n.TranslationOptions> : TReturn;\n        // );\n      },\n    [t, namespace],\n  );\n  return tMemoized;\n};\n\nexport default useT;\n"; });


/***/ })

};
