export const id = 965;
export const ids = [965];
export const modules = {

/***/ 5940:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = (function (_a) {
    var config = _a.config;
    return "\nimport { locales } from \"./locales\";\nimport { defaultLocale } from \"./defaultLocale\";\n\n/**\n */\nexport const config = {\n  locales,\n  defaultLocale,\n  hideDefaultLocaleInUrl: ".concat(config.hideDefaultLocaleInUrl, ",\n}\n\nexport default config;\n");
});


/***/ }),

/***/ 1763:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = (function (_a) {
    var config = _a.config;
    return "\nimport type { I18n } from \"./types\";\n\nexport const defaultLocale: I18n.Locale = \"".concat(config.defaultLocale, "\";\n\nexport default defaultLocale;\n");
});


/***/ }),

/***/ 195:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = (function () { return "\nimport { locales } from \"./locales\";\nimport { to } from \"./to\";\nimport type { I18n } from \"./types\";\n\nfunction getPathnameDynamicPortionName(pathname: string) {\n  const res = pathname.match(/\\[(.+)\\]/);\n  return res ? res[1] : false;\n}\n\nfunction isStaticPathname(pathname: string) {\n  return !/\\[/.test(pathname);\n}\n\n// e.g. ['my', 'path', 'id', 'view'] or ['nl' 'my', 'path', 'id', 'view']\n// where the first might be the locale (depending on hideDefaultLocaleInUrl)\nfunction getPathnameParts(pathname: string) {\n  return pathname\n    .split(\"/\")\n    .slice(1)\n    .filter((p, i) => (i === 0 ? !locales.includes(p as I18n.Locale) : true));\n}\n\nfunction localisePathname(\n  locale: I18n.Locale,\n  // e.g. \"my.path.[id].view\"\n  routeId: I18n.RouteIdDynamic | I18n.RouteIdStatic,\n  locationLike: LocationLike\n) {\n  const toPathname = to(routeId as I18n.RouteIdStatic, locale);\n\n  if (isStaticPathname(toPathname)) {\n    return toPathname;\n  }\n  // e.g. ['my', 'path', '[id]', 'view']\n  const toPathnameParts = getPathnameParts(toPathname);\n  // e.g. \"my.path.[id].view\"\n  const routeIdDynamic = routeId as I18n.RouteIdDynamic;\n  // e.g. /my/path/1 23/view\n  const currentPathname = locationLike.pathname;\n  // e.g. ['my', 'path', '123', 'view']\n  const currentPathnameParts = getPathnameParts(currentPathname);\n  // e.g. { id: \"123\" }\n  const params: Record<string, string> = {};\n\n  for (let i = 0; i < toPathnameParts.length; i++) {\n    // e.g. \"my\" or \"[id]\"\n    const part = toPathnameParts[i];\n    // e.g. \"id\"\n    const name = getPathnameDynamicPortionName(part);\n    if (name) {\n      // e.g. \"123\"\n      const value = currentPathnameParts[i];\n      params[name] = value;\n    }\n  }\n\n  return (\n    to(routeIdDynamic, params as never, locale) +\n    location?.search || \"\" +\n    location?.hash || \"\"\n  );\n}\n\ntype LocationLike = { pathname: string; search?: string; hash?: string; };\n\nexport type LocalisedPathnames = Record<I18n.Locale, string>;\n\nexport const deriveLocalisedPathnames = (routeId: I18n.RouteId, locationLike: LocationLike) =>\n  locales.reduce((pathnames, locale) => {\n    pathnames[locale] = localisePathname(locale, routeId, locationLike);\n    return pathnames;\n  }, {} as LocalisedPathnames);\n\nexport default deriveLocalisedPathnames;\n"; });


/***/ }),

/***/ 7965:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(5331);
var config_1 = tslib_1.__importDefault(__webpack_require__(5940));
var defaultLocale_1 = tslib_1.__importDefault(__webpack_require__(1763));
var deriveLocalisedPathnames_1 = tslib_1.__importDefault(__webpack_require__(195));
var isLocale_1 = tslib_1.__importDefault(__webpack_require__(9785));
var locales_1 = tslib_1.__importDefault(__webpack_require__(9816));
var pathnameToRouteId_1 = tslib_1.__importDefault(__webpack_require__(1731));
var routes_1 = tslib_1.__importDefault(__webpack_require__(1117));
var routesSlim_1 = tslib_1.__importDefault(__webpack_require__(3488));
var tFns_1 = tslib_1.__importDefault(__webpack_require__(4850));
var tInterpolateParams_1 = tslib_1.__importDefault(__webpack_require__(2139));
var to_1 = tslib_1.__importDefault(__webpack_require__(6509));
var toFns_1 = tslib_1.__importDefault(__webpack_require__(232));
var toFormat_1 = tslib_1.__importDefault(__webpack_require__(755));
var types_1 = tslib_1.__importDefault(__webpack_require__(3162));
var adapter = function () {
    return {
        files: [
            { name: "config", fn: config_1.default, ext: "ts", index: true },
            { name: "defaultLocale", fn: defaultLocale_1.default, ext: "ts", index: true },
            {
                name: "deriveLocalisedPathnames",
                fn: deriveLocalisedPathnames_1.default,
                ext: "ts",
                index: true,
            },
            { name: "isLocale", fn: isLocale_1.default, ext: "ts", index: true },
            { name: "locales", fn: locales_1.default, ext: "ts", index: true },
            {
                name: "pathnameToRouteId",
                fn: pathnameToRouteId_1.default,
                ext: "ts",
                index: true,
            },
            { name: "routes", fn: routes_1.default, ext: "ts", index: true },
            { name: "routesSlim", fn: routesSlim_1.default, ext: "ts", index: true },
            { name: "tFns", fn: tFns_1.default, ext: "ts" },
            {
                name: "tInterpolateParams",
                fn: tInterpolateParams_1.default,
                ext: "ts",
                index: false,
            },
            { name: "to", fn: to_1.default, ext: "ts", index: true },
            { name: "toFns", fn: toFns_1.default, ext: "ts", index: true },
            { name: "toFormat", fn: toFormat_1.default, ext: "ts", index: true },
            { name: "types", fn: types_1.default, ext: "ts", index: true },
        ],
    };
};
exports["default"] = adapter;


/***/ }),

/***/ 9785:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = (function () { return "\nimport { locales } from \"./locales\";\nimport type { I18n } from \"./types\";\n\n// eslint-disable-next-line @typescript-eslint/no-explicit-any\nexport const isLocale = (payload: any): payload is I18n.Locale => locales.includes(payload);\n\nexport default isLocale;\n"; });


/***/ }),

/***/ 9816:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = (function (_a) {
    var config = _a.config;
    var value = "[".concat(config.locales.map(function (l) { return "\"".concat(l, "\""); }).join(", "), "]");
    return "\nexport const locales = ".concat(value, " as const;\n\nexport default locales;\n");
});


/***/ }),

/***/ 1731:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = (function () { return "\n/**\n * Convert a URL like pathname to a \"named route\"\n * E.g. it transforms:\n * - `/dashboard/user/[id]` into `dashboard.user.[id]`\n */\nexport const pathnameToRouteId = (pathname: string) =>\n  pathname\n    .replace(/^\\//g, \"\")\n    .replace(/\\//g, \".\")\n    .replace(/\\/index$/, \"\");\n\nexport default pathnameToRouteId;\n"; });


/***/ }),

/***/ 1117:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(5331);
exports["default"] = (function (_a) {
    var data = _a.data;
    var value = JSON.stringify(Object.fromEntries(Object.entries(data.source.routes).map(function (_a) {
        var _b = tslib_1.__read(_a, 2), routeId = _b[0], pathnames = _b[1].pathnames;
        return [
            routeId,
            pathnames,
        ];
    })), null, 2);
    return "\nexport const routes = ".concat(value, " as const;\n\nexport default routes;\n");
});


/***/ }),

/***/ 3488:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(5331);
exports["default"] = (function (_a) {
    var data = _a.data;
    var value = JSON.stringify(Object.fromEntries(Object.entries(data.source.routes).map(function (_a) {
        var _b = tslib_1.__read(_a, 2), routeId = _b[0], _c = _b[1], optimizedPathnames = _c.optimizedPathnames, pathnames = _c.pathnames;
        return [
            routeId,
            optimizedPathnames || pathnames,
        ];
    })), null, 2);
    return "\nexport const routesSlim = ".concat(value, " as const;\n\nexport default routesSlim;\n");
});


/***/ }),

/***/ 4850:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var utils_1 = __webpack_require__(3142);
var helpers_1 = __webpack_require__(7971);
var getTranslationValueOutput = function (value) {
    if ((0, utils_1.isString)(value) || (0, utils_1.isNumber)(value)) {
        return "\"".concat(value, "\"");
    }
    else if ((0, utils_1.isBoolean)(value)) {
        return "".concat(value);
    }
    else if ((0, utils_1.isArray)(value)) {
        return JSON.stringify(value);
    }
    return "(".concat(JSON.stringify(value), ")");
};
var areEqualTranslationsValues = function (a, b) { return (0, utils_1.areEqual)(a, b); };
var getFunctionBodyWithLocales = function (config, perLocaleValues) {
    var defaultLocale = config.defaultLocale;
    var output = "";
    (0, utils_1.forin)(perLocaleValues, function (locale, value) {
        if (locale !== defaultLocale &&
            !areEqualTranslationsValues(value, perLocaleValues[defaultLocale])) {
            output += "locale === \"".concat(locale, "\" ? ").concat(getTranslationValueOutput(value), " : ");
        }
    });
    output += getTranslationValueOutput(perLocaleValues[defaultLocale]);
    return output;
};
exports["default"] = (function (_a) {
    var config = _a.config, data = _a.data;
    var output = "\n/* eslint-disable @typescript-eslint/no-unused-vars */\n/* eslint-disable prefer-const */\nimport type { I18n } from \"./types\";\nimport { tInterpolateParams } from \"./tInterpolateParams\";\n\n";
    (0, utils_1.forin)(data.source.translations, function (translationId, _a) {
        var values = _a.values, params = _a.params, plural = _a.plural;
        var name = "".concat(config.source.translations.fnsPrefix).concat(translationId);
        if (params && plural) {
            params["count"] = "number";
        }
        var argParam = params
            ? "params: { ".concat((0, helpers_1.dataParamsToTsInterfaceBody)(params), " }")
            : "";
        var argLocale = "locale?: I18n.Locale";
        var args = [argParam, argLocale].filter(Boolean).join(", ");
        output += "export let ".concat(name, " = (").concat(args, ") => ");
        var outputFnReturn = "";
        if ((0, utils_1.isPrimitive)(values)) {
            outputFnReturn += getTranslationValueOutput(values);
        }
        else {
            outputFnReturn += getFunctionBodyWithLocales(config, values);
        }
        if (params) {
            outputFnReturn = "tInterpolateParams(".concat(outputFnReturn, ", params);");
        }
        else {
            outputFnReturn = "".concat(outputFnReturn, ";");
        }
        output += outputFnReturn;
        output += "\n";
    });
    return output;
});


/***/ }),

/***/ 2139:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var escapeEachChar = function (input) {
    return input
        .split("")
        .map(function (v) { return "\\".concat(v); })
        .join("");
};
exports["default"] = (function (_a) {
    var config = _a.config;
    var _b = config.source.translations.dynamicDelimiters, start = _b.start, end = _b.end;
    return "\nexport let tInterpolateParams = (\n  value: string,\n  params?: object,\n) =>\n  params ? value.replace(\n    /".concat(escapeEachChar(start), "(.*?)").concat(escapeEachChar(end), "/g,\n    (_, key) =>\n      params[key.trim() as keyof typeof params] + \"\",\n  ) : value;\n\nexport default tInterpolateParams;\n");
});


/***/ }),

/***/ 6509:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = (function (_a) {
    var config = _a.config;
    return "\nimport { isLocale } from \"./isLocale\";\nimport { toFormat } from \"./toFormat\";\nimport { routesSlim } from \"./routesSlim\";\nimport type { I18n } from \"./types\";\n\n/**\n * *To* named route utility. Apart from the required _locale_ and _t_ arguments\n * it accept either a single argument if that is a static route name or a second\n * argument that interpolates the dynamic portions of the route name. The types\n * of these portions are automatically inferred.\n */\nexport function to<TRoute extends I18n.RouteId>(\n  id: TRoute,\n  ...args: TRoute extends I18n.RouteIdDynamic\n    ?\n        | [I18n.Utils.DynamicParams<TRoute>]\n        | [I18n.Utils.DynamicParams<TRoute>, I18n.Locale]\n    : [] | [I18n.Locale]\n) {\n  const params = isLocale(args[0]) ? undefined : args[0];\n  const locale = (isLocale(args[0]) ? args[0] : args[1]) || \"".concat(config.defaultLocale, "\";\n  // eslint-disable-next-line @typescript-eslint/no-explicit-any\n  const pathname = ((routesSlim as any)[id]?.[locale] ?? routesSlim[id]) as string;\n\n  return toFormat(locale, pathname, params);\n}\n\nexport default to;\n");
});


/***/ }),

/***/ 232:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var utils_1 = __webpack_require__(3142);
var getFunctionBodyWithLocales = function (config, perLocaleValues) {
    var defaultLocale = config.defaultLocale;
    var output = "";
    (0, utils_1.forin)(perLocaleValues, function (locale, value) {
        if (locale !== defaultLocale && value !== perLocaleValues[defaultLocale]) {
            output += "locale === \"".concat(locale, "\" ? \"").concat(value, "\" : ");
        }
    });
    output += '"' + perLocaleValues[defaultLocale] + '"';
    return output;
};
exports["default"] = (function (_a) {
    var config = _a.config, data = _a.data;
    var hasOneLocale = config.locales.length === 1;
    var output = "\nimport { toFormat } from \"./toFormat\";\nimport type { I18n } from \"./types\";\n\n";
    (0, utils_1.forin)(data.source.routes, function (routeId, _a) {
        var typeName = _a.typeName, pathnames = _a.pathnames, params = _a.params;
        var name = "to_".concat((0, utils_1.changeCaseCamel)(routeId));
        var paramsType = "I18n.RouteParams.".concat(typeName);
        var argParam = params ? "params: ".concat(paramsType) : "";
        var argLocale = hasOneLocale ? "" : "locale?: I18n.Locale";
        var args = [argParam, argLocale].filter(Boolean).join(", ");
        var formatArgLocale = hasOneLocale ? "\"\"" : "locale";
        var formatArgParams = params ? ", params" : "";
        output += "export let ".concat(name, " = (").concat(args, ") => ");
        if ((0, utils_1.isString)(pathnames)) {
            output += "toFormat(".concat(formatArgLocale, ", \"").concat(pathnames, "\"").concat(formatArgParams, ");");
        }
        else {
            output += "toFormat(".concat(formatArgLocale, ", ").concat(getFunctionBodyWithLocales(config, pathnames)).concat(formatArgParams, ");");
        }
        output += "\n";
    });
    return output;
});


/***/ }),

/***/ 755:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = (function (_a) {
    var config = _a.config;
    return "\nexport function toFormat(\n  locale: string | undefined,\n  pathname: string,\n  params?: object,\n) {\n  locale = locale || \"".concat(config.defaultLocale, "\";\n  if (process.env[\"NODE_ENV\"] === \"development\") {\n    if (params) {\n      pathname.replace(/\\[(.*?)\\]/g, (_, dynamicKey) => {\n        const key = dynamicKey as Extract<keyof typeof params, string>;\n\n        if (!(key in params)) {\n          console.warn(\n            \"[@koine/i18n]::interpolateTo, using '\" +\n              pathname +\n              \"' without param '\" +\n              key +\n              \"'\",\n              { params }\n          );\n        }\n\n        if (![\"string\", \"number\"].includes(typeof params[key])) {\n          console.warn(\n            \"[@koine/i18n]::toFormat, using '\" +\n              pathname +\n              \"' with unserializable param  '\" +\n              key +\n              \"' (type '\" +\n              Object.prototype.toString.call((params[key])).slice(8, -1) +\n              \"')\",\n          );\n        }\n        return \"\";\n      });\n    }\n  }\n\n  if (params) {\n    pathname = pathname.replace(\n        /\\[(.*?)\\]/g,\n        (_, key) =>\n          params[key as keyof typeof params] + \"\",\n      )\n  }\n  ").concat(config.hideDefaultLocaleInUrl
        ? "\n  if (locale !== \"".concat(config.defaultLocale, "\") {\n    return \"/\" + locale + pathname;\n  }\n  ")
        : "", "\n  return pathname;\n}\n\nexport default toFormat;\n");
});


/***/ }),

/***/ 3162:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var node_fs_1 = __webpack_require__(7561);
var node_path_1 = __webpack_require__(9411);
var utils_1 = __webpack_require__(3142);
var helpers_1 = __webpack_require__(7971);
var pluralisation_1 = __webpack_require__(5968);
var buildTypeForObjectValue = function (key, value) {
    if (!(0, utils_1.isArray)(value) && (0, utils_1.isObject)(value)) {
        if ((0, pluralisation_1.hasOnlyPluralKeys)(value)) {
            return "'".concat(key, "': string;");
        }
        if ((0, pluralisation_1.hasPlurals)(value)) {
            return "'".concat(key, "': string | ").concat(buildTypeForValue((0, pluralisation_1.pickNonPluralValue)(value)));
        }
    }
    return "'".concat(key, "': ").concat(buildTypeForValue(value));
};
var buildTypeForValue = function (value) {
    var out = "";
    var primitiveType = "";
    if ((0, utils_1.isBoolean)(value)) {
        primitiveType = "boolean";
    }
    else if ((0, utils_1.isString)(value)) {
        primitiveType = "string";
    }
    if (primitiveType) {
        out += primitiveType + ";";
    }
    else if (!value) {
        out += "";
    }
    else if ((0, utils_1.isArray)(value)) {
        var firstValue = value[0];
        out += "".concat(buildTypeForValue(firstValue), "[];");
    }
    else if ((0, utils_1.isObject)(value)) {
        out += "{";
        var keys = (0, pluralisation_1.transformKeysForPlurals)(Object.keys(value));
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var single = value[key] || "";
            out += buildTypeForObjectValue(key, single);
        }
        out += "};";
    }
    out = out.replace(/;\[\];/g, "[];");
    out = out.replace(/;+/g, ";");
    return out;
};
var buildTranslationsTypes = function (config, dataFs) {
    var translationFiles = dataFs.translationFiles;
    var defaultLocale = config.defaultLocale;
    var defaultLocaleFiles = translationFiles.filter(function (f) { return f.locale === defaultLocale; });
    var out = "\n  export interface Translations {\n";
    for (var i = 0; i < defaultLocaleFiles.length; i++) {
        var _a = defaultLocaleFiles[i], path = _a.path, data = _a.data;
        var namespace = path.replace(".json", "");
        out += "\"".concat(namespace, "\": ").concat(buildTypeForValue(data), "\n");
    }
    out += "\n  }\n";
    return out;
};
var buildRouteParamsInterfaces = function (routes) {
    var output = "\n";
    (0, utils_1.forin)(routes, function (_routeId, _a) {
        var typeName = _a.typeName, params = _a.params;
        if (params) {
            output += "  export interface ".concat(typeName, " { ").concat((0, helpers_1.dataParamsToTsInterfaceBody)(params), " }\n");
        }
    });
    return output;
};
var buildRoutesUnion = function (routes, filterFn) {
    return Object.keys(routes)
        .filter(function (routeId) {
        return filterFn(routeId, routes[routeId]);
    })
        .sort()
        .map(function (routeId) { return "\"".concat(routeId, "\""); })
        .join(" | ");
};
exports["default"] = (function (_a) {
    var config = _a.config, data = _a.data;
    var routeParamsInterfaces = buildRouteParamsInterfaces(data.source.routes);
    var file_types = (0, node_fs_1.readFileSync)((0, node_path_1.join)(__dirname, "../../types.ts"), "utf-8");
    var file_typesUtils = (0, node_fs_1.readFileSync)((0, node_path_1.join)(__dirname, "../../types-utils.ts"), "utf-8");
    var RouteIdStatic = buildRoutesUnion(data.source.routes, function (_, routeData) { return !routeData.params; });
    var RouteIdDynamic = buildRoutesUnion(data.source.routes, function (_, routeData) { return !!routeData.params; });
    return "\n/* eslint-disable @typescript-eslint/no-namespace */\n/* eslint-disable @typescript-eslint/no-explicit-any */\n/* eslint-disable @typescript-eslint/ban-types */\n\nexport namespace I18n {\n  export type Locale = ".concat(config.locales.map(function (l) { return "\"".concat(l, "\""); }).join(" | "), ";\n \n  export type LocalesMap<T = any> = Record<Locale, T>;\n\n  ").concat(buildTranslationsTypes(config, data.fs), "\n").concat(file_types, "\n  \n  // export type RouteId = keyof typeof routesSlim;\n  export type RouteId = RouteIdStatic | RouteIdDynamic;\n  \n  // export type RouteIdStatic = I18n.Utils.RouteStrictIdStatic<RouteId>;\n  export type RouteIdStatic = ").concat(RouteIdStatic, ";\n  \n  // export type RouteIdDynamic = I18n.Utils.RouteStrictIdDynamic<RouteId>;\n  export type RouteIdDynamic = ").concat(RouteIdDynamic, ";\n  \n  /**\n   * Utility standalone type to extract all children routes that starts with the\n   * given string.\n   *\n   * This is useful to get the subroutes of an application area, e.g. all subroutes\n   * of a dashboard, using it with:\n   *\n   * ```\n   * type DashboardRoutes = RoutesChildrenOf<\"dashboard\">;\n   * ```\n   */\n  export type RoutesChildrenOf<\n    TStarts extends string,\n    T extends string = RouteId,\n  > = T extends `${TStarts}.${infer First}` ? `${TStarts}.${First}` : never;   \n}\n\nexport namespace I18n.RouteParams {").concat(routeParamsInterfaces, "}\n\nexport namespace I18n.Utils {\n").concat(file_typesUtils, "\n}\n");
});


/***/ }),

/***/ 7971:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.dataParamsToTsInterfaceBody = void 0;
var dataParamsToTsInterfaceBody = function (params) {
    return Object.keys(params)
        .reduce(function (pairs, paramName) {
        var value = params[paramName];
        var type = "";
        switch (value) {
            case "number":
                type = "number";
                break;
            case "string":
                type = "string";
                break;
            default:
                type = "string | number";
                break;
        }
        pairs.push("".concat(paramName, ": ").concat(type, ";"));
        return pairs;
    }, [])
        .join(" ");
};
exports.dataParamsToTsInterfaceBody = dataParamsToTsInterfaceBody;


/***/ })

};
