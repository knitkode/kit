---
"@knitkode/utils": patch
---

Fix more helpers:

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
