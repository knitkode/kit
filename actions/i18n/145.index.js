export const id = 145;
export const ids = [145];
export const modules = {

/***/ 5145:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(5331);
var next_redirects_1 = tslib_1.__importDefault(__webpack_require__(8164));
var next_rewrites_1 = tslib_1.__importDefault(__webpack_require__(7684));
var useCurrentLocalisedPathnames_1 = tslib_1.__importDefault(__webpack_require__(3479));
var useLocale_1 = tslib_1.__importDefault(__webpack_require__(6139));
var useRouteId_1 = tslib_1.__importDefault(__webpack_require__(2973));
var useTo_1 = tslib_1.__importDefault(__webpack_require__(9735));
var withI18n_1 = tslib_1.__importDefault(__webpack_require__(2582));
var adapter = function () {
    return {
        dependsOn: ["js"],
        files: [
            { name: "next-redirects", fn: next_redirects_1.default, ext: "js" },
            { name: "next-rewrites", fn: next_rewrites_1.default, ext: "js" },
            {
                name: "useCurrentLocalisedPathnames",
                fn: useCurrentLocalisedPathnames_1.default,
                ext: "ts",
                index: true,
            },
            { name: "useLocale", fn: useLocale_1.default, ext: "ts", index: true },
            { name: "useRouteId", fn: useRouteId_1.default, ext: "ts", index: true },
            { name: "useTo", fn: useTo_1.default, ext: "ts", index: true },
            { name: "withI18n", fn: withI18n_1.default, ext: "js" },
        ],
    };
};
exports["default"] = adapter;


/***/ }),

/***/ 8164:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getRedirects = void 0;
var tslib_1 = __webpack_require__(5331);
var utils_1 = __webpack_require__(3142);
var getPathRedirect_1 = __webpack_require__(7419);
var transformPathname_1 = __webpack_require__(9190);
function getRedirects(config, routes, localeParam, permanent) {
    if (localeParam === void 0) { localeParam = ""; }
    if (permanent === void 0) { permanent = false; }
    var defaultLocale = config.defaultLocale, hideDefaultLocaleInUrl = config.hideDefaultLocaleInUrl;
    var redirects = [];
    for (var routeId in routes) {
        var route = routes[routeId];
        var pathnamesByLocale = routes[routeId].pathnames;
        for (var locale in pathnamesByLocale) {
            var localisedPathname = pathnamesByLocale[locale];
            var template = (0, transformPathname_1.transformPathname)(route, routeId.replace(/\./g, "/"));
            var pathname = (0, transformPathname_1.transformPathname)(route, localisedPathname);
            if (route.inWildcard)
                break;
            var isVisibleDefaultLocale = locale === defaultLocale && !hideDefaultLocaleInUrl;
            var isHiddenDefaultLocale = locale === defaultLocale && hideDefaultLocaleInUrl;
            if (localeParam) {
                if (isVisibleDefaultLocale) {
                    redirects.push((0, getPathRedirect_1.getPathRedirect)({
                        localeDestination: locale,
                        permanent: permanent,
                        template: template,
                        pathname: pathname,
                    }));
                }
                else if (isHiddenDefaultLocale) {
                    redirects.push((0, getPathRedirect_1.getPathRedirect)({
                        localeSource: locale,
                        permanent: permanent,
                        template: template,
                        pathname: pathname,
                    }));
                }
                else if (locale !== defaultLocale) {
                    redirects.push((0, getPathRedirect_1.getPathRedirect)({
                        localeSource: locale,
                        localeDestination: locale,
                        permanent: permanent,
                        template: template,
                        pathname: pathname,
                    }));
                }
                else {
                    redirects.push((0, getPathRedirect_1.getPathRedirect)({ permanent: permanent, template: template, pathname: pathname }));
                }
            }
            else {
                if (pathname !== template) {
                    if (isVisibleDefaultLocale) {
                        redirects.push((0, getPathRedirect_1.getPathRedirect)({
                            localeDestination: locale,
                            permanent: permanent,
                            template: template,
                            pathname: pathname,
                        }));
                    }
                    else if (locale !== defaultLocale) {
                        redirects.push((0, getPathRedirect_1.getPathRedirect)({
                            localeSource: locale,
                            localeDestination: locale,
                            permanent: permanent,
                            template: template,
                            pathname: pathname,
                        }));
                    }
                    else {
                        redirects.push((0, getPathRedirect_1.getPathRedirect)({ permanent: permanent, template: template, pathname: pathname }));
                    }
                }
            }
        }
    }
    var cleaned = (0, utils_1.arrayUniqueByProperties)(redirects.filter(Boolean), ["source", "destination"]).map(function (rewrite) { return (localeParam ? rewrite : tslib_1.__assign(tslib_1.__assign({}, rewrite), { locale: false })); });
    return cleaned;
}
exports.getRedirects = getRedirects;
exports["default"] = (function (_a) {
    var config = _a.config, data = _a.data;
    var value = JSON.stringify(getRedirects(config, data.source.routes), null, 2);
    return "module.exports = ".concat(value);
});


/***/ }),

/***/ 7684:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getRewrites = void 0;
var utils_1 = __webpack_require__(3142);
var getPathRewrite_1 = __webpack_require__(7403);
var transformPathname_1 = __webpack_require__(9190);
function getRewrites(config, routes, localeParam) {
    if (localeParam === void 0) { localeParam = ""; }
    var defaultLocale = config.defaultLocale, hideDefaultLocaleInUrl = config.hideDefaultLocaleInUrl;
    var rewrites = [];
    for (var routeId in routes) {
        var route = routes[routeId];
        var pathnamesByLocale = routes[routeId].pathnames;
        for (var locale in pathnamesByLocale) {
            var localisedPathname = pathnamesByLocale[locale];
            var isVisibleDefaultLocale = locale === defaultLocale && !hideDefaultLocaleInUrl;
            var isHiddenDefaultLocale = locale === defaultLocale && hideDefaultLocaleInUrl;
            var template = (0, transformPathname_1.transformPathname)(route, routeId.replace(/\./g, "/"));
            var pathname = (0, transformPathname_1.transformPathname)(route, localisedPathname);
            if (route.inWildcard)
                break;
            if (localeParam) {
                if (isHiddenDefaultLocale) {
                    rewrites.push((0, getPathRewrite_1.getPathRewrite)({
                        localeDestination: locale,
                        route: route,
                        template: template,
                        pathname: pathname,
                    }));
                }
                else {
                    rewrites.push((0, getPathRewrite_1.getPathRewrite)({
                        localeDestination: locale,
                        localeSource: locale,
                        route: route,
                        template: template,
                        pathname: pathname,
                    }));
                }
            }
            else {
                if (pathname !== template) {
                    if (locale !== defaultLocale || isVisibleDefaultLocale) {
                        rewrites.push((0, getPathRewrite_1.getPathRewrite)({
                            localeSource: locale,
                            route: route,
                            template: template,
                            pathname: pathname,
                        }));
                    }
                    else {
                        rewrites.push((0, getPathRewrite_1.getPathRewrite)({ route: route, template: template, pathname: pathname }));
                    }
                }
            }
        }
    }
    var cleaned = (0, utils_1.arrayUniqueByProperties)(rewrites.filter(Boolean), ["source", "destination"]);
    return cleaned;
}
exports.getRewrites = getRewrites;
exports["default"] = (function (_a) {
    var config = _a.config, data = _a.data;
    var value = JSON.stringify(getRewrites(config, data.source.routes), null, 2);
    return "module.exports = ".concat(value);
});


/***/ }),

/***/ 9190:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.transformPathname = void 0;
function transformPathname(route, rawPathnameOrTemplate) {
    return ("/" +
        rawPathnameOrTemplate
            .split("/")
            .filter(Boolean)
            .map(function (part) {
            if (part.startsWith("[")) {
                return ":".concat(encodeURIComponent(part.slice(1, -1)));
            }
            return "".concat(encodeURIComponent(part));
        })
            .join("/") +
        (route.wildcard ? "/:wildcard*" : ""));
}
exports.transformPathname = transformPathname;


/***/ }),

/***/ 3479:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = (function () { return "\n\"use client\";\n\nimport { useEffect, useState } from \"react\";\nimport { deriveLocalisedPathnames, type LocalisedPathnames } from \"./deriveLocalisedPathnames\";\nimport { useRouteId } from \"./useRouteId\";\n\nexport function useCurrentLocalisedPathnames() {\n  const routeId = useRouteId();\n  const [urls, setUrls] = useState<LocalisedPathnames>({} as LocalisedPathnames);\n\n  useEffect(() => {\n    setUrls(deriveLocalisedPathnames(routeId, location));\n  }, [routeId]);\n\n  return urls;\n}\n\nexport default useCurrentLocalisedPathnames;\n"; });


/***/ }),

/***/ 6139:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = (function (_a) {
    var config = _a.config;
    return "\nimport { useRouter } from \"next/router\";\nimport type { I18n } from \"./types\";\n\nexport const useLocale = () => (useRouter().locale as I18n.Locale) || \"".concat(config.defaultLocale, "\";\n\nexport default useLocale;\n");
});


/***/ }),

/***/ 2973:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = (function () { return "\nimport { useRouter } from \"next/router\";\nimport type { I18n } from \"./types\";\nimport { pathnameToRouteId } from \"./pathnameToRouteId\";\n\nexport const useRouteId = () => \n  pathnameToRouteId(useRouter().pathname) as I18n.RouteId;\n\nexport default useRouteId;\n"; });


/***/ }),

/***/ 9735:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = (function () { return "\n\"use client\";\n\nimport { to } from \"./to\";\nimport type { I18n } from \"./types\";\nimport { useLocale } from \"./useLocale\";\n\nexport type UseToReturn = ReturnType<typeof useTo>;\n\nexport const useTo = () => {\n  const locale = useLocale();\n  return <TRoute extends I18n.RouteId>(\n    ...args: TRoute extends I18n.RouteIdDynamic\n      ? [routeId: TRoute, params: I18n.Utils.DynamicParams<TRoute>]\n      : TRoute extends I18n.RouteIdStatic\n        ? [routeId: I18n.RouteIdStatic]\n        : never\n  ) => {\n    const [routeId, params] = args;\n    return params\n      ? to(routeId, params, locale)\n      : to(routeId as I18n.RouteIdStatic, locale);\n  };\n};\n\nexport default useTo;\n"; });


/***/ }),

/***/ 2582:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = (function (_a) {
    var config = _a.config;
    var locales = config.locales, defaultLocale = config.defaultLocale, hideDefaultLocaleInUrl = config.hideDefaultLocaleInUrl;
    return "\nconst withTranslate = require(\"next-translate-plugin\");\nconst webpack = require(\"webpack\");\nconst defaultRedirects = require(\"./next-redirects\");\nconst defaultRewrites = require(\"./next-rewrites\");\n\n/**\n * @typedef {import(\"next\").NextConfig} NextConfig\n * \n * @typedef {object} WithI18nOptions\n * @property {boolean} [permanent] Whether the routes redirecting should be permanent. Switch this on once you go live and the routes structure is stable.\n * @property {string} [localeParam]\n */\n\n/**\n * Get Next.js config with some basic opinionated defaults\n * \n * @param {WithI18nOptions} options\n */\nconst withI18n = ({ permanent, localeParam } = {}) =>\n  /**\n   * @param {Omit<NextConfig, \"i18n\">} nextConfig\n   * @returns {Omit<NextConfig, \"i18n\"> & { i18n: Required<NextConfig[\"i18n\"]> }\n   */\n  (nextConfig) => {\n    const locales = [".concat(locales.map(function (l) { return "\"".concat(l, "\""); }).join(", "), "];\n    const defaultLocale = \"").concat(defaultLocale, "\";\n    // const hideDefaultLocaleInUrl = ").concat(hideDefaultLocaleInUrl ? "true" : "false", ";\n\n    if (localeParam) {\n      // app router:\n      // NOTE: after thousands attempts turns out that passing the i18n settings\n      // to the app router messes up everything, just rely on our internal i18n\n      // mechanisms\n      delete nextConfig.i18n;\n    } else {\n      // pages routes:\n      nextConfig.i18n = nextConfig.i18n || {};\n      nextConfig.i18n.locales = locales;\n      nextConfig.i18n.defaultLocale = defaultLocale;\n    }\n\n    const newNextConfig = {\n      ...nextConfig,\n      async redirects() {\n        if (nextConfig.redirects) {\n          const custom = await nextConfig.redirects();\n          return [...defaultRedirects, ...custom];\n        }\n        return defaultRedirects;\n      },\n      async rewrites() {\n        if (nextConfig.rewrites) {\n          const custom = await nextConfig.rewrites();\n\n          if (Array.isArray(custom)) {\n            return {\n              beforeFiles: defaultRewrites,\n              afterFiles: custom,\n              fallback: [],\n            };\n          }\n\n          return {\n            ...custom,\n            beforeFiles: [...defaultRewrites, ...(custom.beforeFiles || [])],\n          };\n        }\n        return {\n          beforeFiles: defaultRewrites,\n          afterFiles: [],\n          fallback: [],\n        };\n      },\n    };\n\n    nextConfig.webpack = (config, options) => {\n      const webpackConfig =\n        typeof nextConfig.webpack === \"function\"\n          ? nextConfig.webpack(config, options)\n          : config;\n\n      // @see https://github.com/date-fns/date-fns/blob/main/docs/webpack.md#removing-unused-languages-from-dynamic-import\n      webpackConfig.plugins.push(\n        new webpack.ContextReplacementPlugin(\n          /^date-fns[/\\\\]locale$/,\n          /\\.[/\\\\](").concat(locales.join("|"), ")[/\\\\]index\\.js$/\n          // new RegExp(`\\\\.[/\\\\\\\\](").concat(locales.join("|"), ")[/\\\\\\\\]index\\\\.js$`)\n        )\n      );\n\n      return webpackConfig;\n    };\n\n    // TODO: move to next-translate adapter\n    return withTranslate(newNextConfig);\n  }\n\nmodule.exports = { withI18n };\n");
});


/***/ }),

/***/ 7419:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getPathRedirect = void 0;
var client_1 = __webpack_require__(5504);
function getPathRedirect(arg) {
    var localeSource = arg.localeSource, localeDestination = arg.localeDestination, template = arg.template, pathname = arg.pathname, permanent = arg.permanent;
    var sourcePrefix = localeSource ? "".concat(localeSource, "/") : "";
    var source = (0, client_1.formatRoutePathname)(sourcePrefix + template);
    var destinationPrefix = localeDestination ? "".concat(localeDestination, "/") : "";
    var destination = (0, client_1.formatRoutePathname)(destinationPrefix + pathname);
    if (source === destination)
        return;
    var redirect = {
        source: source,
        destination: destination,
        permanent: Boolean(permanent),
    };
    return redirect;
}
exports.getPathRedirect = getPathRedirect;


/***/ }),

/***/ 7403:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getPathRewrite = void 0;
var client_1 = __webpack_require__(5504);
function getPathRewrite(arg) {
    var localeSource = arg.localeSource, localeDestination = arg.localeDestination, localeParam = arg.localeParam, template = arg.template, pathname = arg.pathname;
    var sourcePrefix = "";
    if (localeSource)
        sourcePrefix = "/".concat(localeSource);
    else if (localeParam)
        sourcePrefix = "/:".concat(localeParam);
    var source = (0, client_1.formatRoutePathname)(sourcePrefix + pathname);
    var destinationPrefix = "";
    if (localeDestination)
        destinationPrefix = "/".concat(localeDestination);
    else if (localeParam)
        destinationPrefix = "/:".concat(localeParam);
    var destination = (0, client_1.formatRoutePathname)(destinationPrefix + template);
    if (source === destination)
        return;
    return {
        source: source,
        destination: destination,
    };
}
exports.getPathRewrite = getPathRewrite;


/***/ })

};
