# @knitkode/utils

[![npm](https://img.shields.io/npm/v/@knitkode/utils)](https://www.npmjs.com/package/@knitkode/utils)
[![API reference](https://img.shields.io/badge/docs-API%20reference-blue)](https://knitkode.github.io/kit/modules/_knitkode_utils.html)

Tree-shakeable TypeScript utilities for everyday web development: type guards, object and array helpers, string case conversion, URL, cookie and timing helpers. It also re-exports [type-fest](https://github.com/sindresorhus/type-fest) types.

## Install

```bash
pnpm add @knitkode/utils
# or: npm install @knitkode/utils
```

## Usage

```ts
import { changeCaseCamel, debounce, isFullString, objectPick, slugify } from "@knitkode/utils";

slugify("Hello World"); // "hello-world"
changeCaseCamel("hello world"); // "helloWorld"
objectPick({ a: 1, b: 2, c: 3 }, ["a", "c"]); // { a: 1, c: 3 }

const onResize = debounce(() => console.log("resized"), 200);

function greet(name: unknown) {
  if (isFullString(name)) return `Hello ${name}`; // `name` is narrowed to `string`
}
```

## Entry points

Import from `@knitkode/utils`, or from one subpath per module to load only that module, e.g. `@knitkode/utils/slugify`.

<details>
<summary>All 175 subpaths</summary>

- `@knitkode/utils/accentsSets`
- `@knitkode/utils/addOrReplaceAtIdx`
- `@knitkode/utils/areEqual`
- `@knitkode/utils/arrayFilterFalsy`
- `@knitkode/utils/arrayFindLastIndex`
- `@knitkode/utils/arrayOfAll`
- `@knitkode/utils/arraySum`
- `@knitkode/utils/arrayToLookup`
- `@knitkode/utils/arrayUniqueByProperties`
- `@knitkode/utils/buildUrlQueryString`
- `@knitkode/utils/capitalize`
- `@knitkode/utils/changeCaseCamel`
- `@knitkode/utils/changeCaseCapital`
- `@knitkode/utils/changeCaseConstant`
- `@knitkode/utils/changeCaseDot`
- `@knitkode/utils/changeCaseEnvVarName`
- `@knitkode/utils/changeCaseHelpers`
- `@knitkode/utils/changeCaseKebab`
- `@knitkode/utils/changeCaseNone`
- `@knitkode/utils/changeCasePascal`
- `@knitkode/utils/changeCasePascalSnake`
- `@knitkode/utils/changeCasePath`
- `@knitkode/utils/changeCaseSentence`
- `@knitkode/utils/changeCaseSnake`
- `@knitkode/utils/changeCaseTrain`
- `@knitkode/utils/chunkByChunks`
- `@knitkode/utils/chunkBySize`
- `@knitkode/utils/clamp`
- `@knitkode/utils/clsx`
- `@knitkode/utils/convertRange`
- `@knitkode/utils/cookie`
- `@knitkode/utils/createConsole`
- `@knitkode/utils/createPalette`
- `@knitkode/utils/debounce`
- `@knitkode/utils/debouncePromise`
- `@knitkode/utils/debounceRaf`
- `@knitkode/utils/decode`
- `@knitkode/utils/Defer`
- `@knitkode/utils/Emitter`
- `@knitkode/utils/encode`
- `@knitkode/utils/ensureInt`
- `@knitkode/utils/errorToString`
- `@knitkode/utils/escapeRegExp`
- `@knitkode/utils/findDuplicatedIndexes`
- `@knitkode/utils/forin`
- `@knitkode/utils/gbToBytes`
- `@knitkode/utils/getEmptyArray`
- `@knitkode/utils/getKeys`
- `@knitkode/utils/getMediaQueryWidthResolvers`
- `@knitkode/utils/getMediaQueryWidthTailwindScreens`
- `@knitkode/utils/getNonce`
- `@knitkode/utils/getParamAmong`
- `@knitkode/utils/getParamAsInt`
- `@knitkode/utils/getParamAsString`
- `@knitkode/utils/getType`
- `@knitkode/utils/getUrlHashParams`
- `@knitkode/utils/getUrlHashPathname`
- `@knitkode/utils/getUrlPathnameParts`
- `@knitkode/utils/getUrlQueryParams`
- `@knitkode/utils/hashAny`
- `@knitkode/utils/imgEmptyPixel`
- `@knitkode/utils/invariant`
- `@knitkode/utils/isAbsoluteUrl`
- `@knitkode/utils/isAnyObject`
- `@knitkode/utils/isArray`
- `@knitkode/utils/isBlob`
- `@knitkode/utils/isBoolean`
- `@knitkode/utils/isBrowser`
- `@knitkode/utils/isBrowserNow`
- `@knitkode/utils/isDate`
- `@knitkode/utils/isEmptyArray`
- `@knitkode/utils/isEmptyObject`
- `@knitkode/utils/isEmptyString`
- `@knitkode/utils/isError`
- `@knitkode/utils/isExternalUrl`
- `@knitkode/utils/isFile`
- `@knitkode/utils/isFloat`
- `@knitkode/utils/isFormData`
- `@knitkode/utils/isFullArray`
- `@knitkode/utils/isFullObject`
- `@knitkode/utils/isFullString`
- `@knitkode/utils/isFunction`
- `@knitkode/utils/isInt`
- `@knitkode/utils/isMap`
- `@knitkode/utils/isNaNValue`
- `@knitkode/utils/isNegativeNumber`
- `@knitkode/utils/isNull`
- `@knitkode/utils/isNullOrUndefined`
- `@knitkode/utils/isNumber`
- `@knitkode/utils/isNumericLiteral`
- `@knitkode/utils/isObject`
- `@knitkode/utils/isObjectLike`
- `@knitkode/utils/isObjectStringKeyed`
- `@knitkode/utils/isOneOf`
- `@knitkode/utils/isPlainObject`
- `@knitkode/utils/isPositiveNumber`
- `@knitkode/utils/isPrimitive`
- `@knitkode/utils/isPromise`
- `@knitkode/utils/isRegExp`
- `@knitkode/utils/isServer`
- `@knitkode/utils/isServerNow`
- `@knitkode/utils/isSet`
- `@knitkode/utils/isString`
- `@knitkode/utils/isSymbol`
- `@knitkode/utils/isType`
- `@knitkode/utils/isUndefined`
- `@knitkode/utils/isWeakMap`
- `@knitkode/utils/isWeakSet`
- `@knitkode/utils/kbToBytes`
- `@knitkode/utils/location`
- `@knitkode/utils/lowercase`
- `@knitkode/utils/mapListBy`
- `@knitkode/utils/matchSorter`
- `@knitkode/utils/mbToBytes`
- `@knitkode/utils/mergeUrlQueryParams`
- `@knitkode/utils/moveSortableArrayItemByKey`
- `@knitkode/utils/noop`
- `@knitkode/utils/normaliseUrl`
- `@knitkode/utils/normaliseUrlPathname`
- `@knitkode/utils/objectEntries`
- `@knitkode/utils/objectFlat`
- `@knitkode/utils/objectFlip`
- `@knitkode/utils/objectKeys`
- `@knitkode/utils/objectKeysMap`
- `@knitkode/utils/objectMerge`
- `@knitkode/utils/objectMergeArrayFn`
- `@knitkode/utils/objectMergeCreate`
- `@knitkode/utils/objectMergeFn`
- `@knitkode/utils/objectMergeWithDefaults`
- `@knitkode/utils/objectOmit`
- `@knitkode/utils/objectPick`
- `@knitkode/utils/objectSort`
- `@knitkode/utils/objectSortByKeysMatching`
- `@knitkode/utils/objectSwap`
- `@knitkode/utils/objectToArray`
- `@knitkode/utils/parseCookie`
- `@knitkode/utils/parseURL`
- `@knitkode/utils/promiseAllSorted`
- `@knitkode/utils/quaranteneProps`
- `@knitkode/utils/randomInt`
- `@knitkode/utils/randomKey`
- `@knitkode/utils/readCookie`
- `@knitkode/utils/removeAccents`
- `@knitkode/utils/removeCookie`
- `@knitkode/utils/removeDuplicates`
- `@knitkode/utils/removeDuplicatesByKey`
- `@knitkode/utils/removeDuplicatesComparing`
- `@knitkode/utils/removeIndexesFromArray`
- `@knitkode/utils/removeTrailingSlash`
- `@knitkode/utils/removeUrlQueryParams`
- `@knitkode/utils/render`
- `@knitkode/utils/round`
- `@knitkode/utils/roundTo`
- `@knitkode/utils/serializeCookie`
- `@knitkode/utils/setCookie`
- `@knitkode/utils/shuffle`
- `@knitkode/utils/slugify`
- `@knitkode/utils/split`
- `@knitkode/utils/splitReverse`
- `@knitkode/utils/throttle`
- `@knitkode/utils/titleCase`
- `@knitkode/utils/toNumber`
- `@knitkode/utils/toRgba`
- `@knitkode/utils/transformToUrlPathname`
- `@knitkode/utils/truncate`
- `@knitkode/utils/tryUntil`
- `@knitkode/utils/types`
- `@knitkode/utils/uid`
- `@knitkode/utils/updateLinkParams`
- `@knitkode/utils/updateUrlQueryParams`
- `@knitkode/utils/uppercase`
- `@knitkode/utils/urlSearchParamsSerializer`
- `@knitkode/utils/uuid`
- `@knitkode/utils/uuidNumeric`
- `@knitkode/utils/wait`

</details>

The ambient helper types (`Tweak`, `AssertTrue`, ...) are opt-in:

```ts
/// <reference types="@knitkode/utils/typings" />
```

## Requirements

ES modules only, with TypeScript declarations included. Use `"moduleResolution": "bundler"`, `"node16"` or `"nodenext"` in TypeScript projects. See the [repository README](../../README.md#requirements).

## Changelog

See [CHANGELOG.md](./CHANGELOG.md). Upgrading from `@koine/*`? Read the [migration guide](../../docs/migrating-to-v3.md).

## License

[MIT](./LICENSE)
