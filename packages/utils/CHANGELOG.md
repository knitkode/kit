# @knitkode/utils

## 3.0.1

### Patch Changes

- [`113cd75`](https://github.com/knitkode/kit/commit/113cd754ba6cf9497752643541defcceebf34a95) Thanks [@kuus](https://github.com/kuus)! - Fix several helpers:
  
  - `isExternalUrl` compares against the given `currentUrl` (it used to always fall back to `location.href`) and works outside the browser. It only matches URLs starting with `http(s)://`, compares hosts case-insensitively and supports hosts without a dot such as `localhost`.
  - `isServerNow` and `isBrowserNow` no longer throw where `window` is not declared, like in Node.js.
  - `round` rounds when `decimals` is falsy (`round(1.7)` is `2`, it used to truncate to `1`). With `trailingZeroes` it returns the formatted string (`round(1.2, 2, true)` is `"1.20"`), the only way to keep the zeroes.
  - `ensureInt` truncates numbers like it already did with strings (`ensureInt(1.9)` is `1`, it used to round to `2`). Non numeric input gives `NaN`.
  - `slugify` replaces underscores and the other punctuation with the separator (`slugify("foo_bar")` is `"foo-bar"`).
  - `removeAccents` keeps the case of the replaced letters (`"École"` gives `"Ecole"`, it used to give `"ecole"`).
  - `titleCase` capitalises words starting with any letter (`"élan vital"` gives `"Élan Vital"`).
  - `isFloat(Infinity)` is `false`.
  - The `Split` type matches the runtime for empty strings and trailing delimiters (`split("a,", ",")` is typed `["a", ""]`).
  - `encode` encodes line breaks and characters from code point 1000 up (`€`, CJK, emoji), which it used to corrupt, and `decode` reverses them. The output of the other characters is unchanged, and `decode` still reads values encoded by previous versions.

- [`89e3ba6`](https://github.com/knitkode/kit/commit/89e3ba66f33f8b5c8b7ecc2350d5dadbfd6bc143) Thanks [@kuus](https://github.com/kuus)! - Fix more helpers:
  
  - `throttle` passes its arguments to the throttled function (it used to throw or drop them), which also fixes the throttled listeners of `@knitkode/dom`.
  - Cookies: `setCookie` applies the default `path=/` and writes `expires` (days or `Date`) correctly, so `removeCookie` really removes the cookie. `setCookie` no longer throws where `document` is not declared.
  - `getNonce` returns `null` instead of throwing where `__webpack_nonce__` is not declared.
  - `objectFlat` keeps `null` values instead of throwing, `objectMergeWithDefaults` no longer mutates the defaults and applies `deleteIfNull` to nested objects, `objectSortByKeysMatching` always puts the matching key first.
  - `removeDuplicatesByKey` compares values with `SameValueZero` (`1` and `"1"` are different, keys like `"toString"` are kept).
  - `chunkByChunks` returns the requested number of chunks in unbalanced mode, `chunkBySize` with a size below 1 returns the whole array (it used to loop forever).
  - `createPalette` keeps the order of the given shades.
  - URLs: `buildUrlQueryString` encodes the keys too, `getUrlQueryParams` ignores the hash and decodes the keys, `getUrlHashPathname` strips the `#` and the leading slashes, `getParamAsInt` returns the fallback for non numeric values, `parseURL` returns `null` for invalid ports.
  - `debouncePromise` with `isImmediate` settles the promises of the calls made during the wait, with the immediate call result.
  - `invariant` is typed as an assertion and its messages follow the documented `[lib:prefix]: message` format (`"Invariant failed"` without a message).
  - Types: `Defer()` type-checks as documented and `Deferred` has its `promise`, `ArrayOfAll` resolves to `"Incomplete"` for incomplete lists.

- [`b131ad6`](https://github.com/knitkode/kit/commit/b131ad61ba1956a5efb1f2a0ad00c76870da8899) Thanks [@kuus](https://github.com/kuus)! - Export `changeCaseCapital`, `changeCaseNone`, `changeCasePascalSnake`, `removeDuplicates` and `render` from the package root. They were only available from their own subpaths (e.g. `@knitkode/utils/render`), which still work.

## 3.0.0

### Major Changes

- [`2f0b11e`](https://github.com/knitkode/kit/commit/2f0b11e8cb991b8ef06bbd8851beac2756652a06) Thanks [@kuus](https://github.com/kuus)! - First release under the `@knitkode` npm scope. These packages were previously published as `@koine/*` (last version `2.0.0-beta.217`). Follow the [migration guide](https://github.com/knitkode/kit/blob/main/docs/migrating-to-v3.md) to upgrade.
  
  - Packages are renamed from `@koine/<name>` to `@knitkode/<name>`. `@koine/i18n` and `@koine/next` are not part of kit: internationalization now lives in the separate Koine project.
  - Packages are ESM-only, with no CommonJS builds. Bundlers need no changes. Node.js can still `require()` them from 20.19 / 22.12. TypeScript users need `moduleResolution` set to `bundler`, `node16` or `nodenext`.
  - Only the documented entry points can be imported: the package root and one subpath per module, e.g. `@knitkode/utils/isArray`. The old `*.cjs.js` and `*.esm.js` files and internal paths are gone.
  - Renamed exports: `KoineComponent` → `KitComponent`, `KoineComponentProps` → `KitComponentProps`, `KoineCalendar*` → `KitCalendar*` (`@knitkode/react`), the global `Koine.Api` namespace → `Kit.Api` (`@knitkode/api/typings`), `swcTransformsKoine` → `swcTransformsKit` (`@knitkode/node/swc`).
  - Removed subpaths: `@koine/api/swr/createSwrApi` (use `@knitkode/api/swr`), `@koine/api/swr-mutation/createSwrApi` (use `@knitkode/api/swr-mutation`) and the empty `@koine/utils/without`.
  - `@knitkode/dom` exports the `EventCallback` and `ListenEvent` types (from the package root) used by `listen`, `listenOnce`, `unlisten` and `getListeners`. Their declarations used to reference these types without shipping them.
  - `@knitkode/api/typings` now resolves under `node16` and `nodenext` module resolution.
  - Packages are MIT licensed and published from CI with npm provenance.
