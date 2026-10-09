---
"@knitkode/browser": patch
---

Fix `navigateToHash`, which doubled the `?` of the current query string (`/page??a=1#hash`), and make the storage helpers (`storageClient`, `storage`, `createStorage`) return stored falsy values (`0`, `false`, `""`) instead of `null` or the default, and apply falsy defaults in `getAll`.
