# @knitkode/browser

[![npm](https://img.shields.io/npm/v/@knitkode/browser)](https://www.npmjs.com/package/@knitkode/browser)
[![API reference](https://img.shields.io/badge/docs-API%20reference-blue)](https://knitkode.github.io/kit/modules/_knitkode_browser.html)

Browser helpers: URL search and hash navigation through the History API, typed `localStorage`/`sessionStorage` clients, Google gtag helpers, device detection and timezone-aware dates.

## Install

```bash
pnpm add @knitkode/browser
# or: npm install @knitkode/browser
```

## Usage

```ts
import { createStorage, isMobile, navigateToParams } from "@knitkode/browser";

// update the query string without reloading, returns "?page=2&sort=name"
navigateToParams({ page: 2, sort: "name" });

// typed storage with encoded keys and values
const prefs = createStorage<{ theme: "dark" | "light"; visits: number }>({
  theme: "light",
  visits: 0,
});
prefs.set("theme", "dark");
prefs.get("theme"); // "dark"

if (isMobile()) {
  // ...
}
```

## Entry points

Import from `@knitkode/browser`, or from one subpath per module, e.g. `@knitkode/browser/navigateToParams`.

<details>
<summary>All 19 subpaths</summary>

- `@knitkode/browser/createStorage`
- `@knitkode/browser/getZonedDate`
- `@knitkode/browser/gtag`
- `@knitkode/browser/gtagPageview`
- `@knitkode/browser/isIE`
- `@knitkode/browser/isMobile`
- `@knitkode/browser/isWindowInsideIframe`
- `@knitkode/browser/listenUrlSearch`
- `@knitkode/browser/listenUrlSearchParams`
- `@knitkode/browser/navigateToHash`
- `@knitkode/browser/navigateToHashParams`
- `@knitkode/browser/navigateToMergedHashParams`
- `@knitkode/browser/navigateToMergedParams`
- `@knitkode/browser/navigateToParams`
- `@knitkode/browser/navigateToUrl`
- `@knitkode/browser/navigateWithoutUrlParam`
- `@knitkode/browser/redirectTo`
- `@knitkode/browser/storage`
- `@knitkode/browser/storageClient`

</details>

## Requirements

ES modules only, with TypeScript declarations included. Use `"moduleResolution": "bundler"`, `"node16"` or `"nodenext"` in TypeScript projects. See the [repository README](../../README.md#requirements).

## Changelog

See [CHANGELOG.md](./CHANGELOG.md). Upgrading from `@koine/*`? Read the [migration guide](../../docs/migrating-to-v3.md).

## License

[MIT](./LICENSE)
