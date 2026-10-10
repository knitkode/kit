# @knitkode/dom

## 3.0.1

### Patch Changes

- [`a04e3ff`](https://github.com/knitkode/kit/commit/a04e3ffbd88d6ee664b3e22546c2e6d66bdd851a) Thanks [@kuus](https://github.com/kuus)! - Fix the event helpers and a few DOM utilities:
  
  - The unbind functions returned by `on`, `listenScroll`, `listenScrollDebounced` and `listenScrollThrottled` remove listeners added with capture (they used to do nothing), and `once(el, type, fn, true)` fires only once.
  - `unlisten` matches callbacks by reference instead of by their source code, removes only the matching listener (it used to drop every listener of a type that had just one), and can remove a `listenOnce` listener given its original callback. A new function with the same body as the registered one no longer removes it.
  - Delegated listeners: a `listenOnce` callback no longer makes the next listener skip the event, and listeners with a selector no longer throw for events fired on `window` or `document`.
  - `getListeners` returns copies, mutating them no longer changes the registry.
  - `addClass` and `removeClass` called without a class name do nothing instead of throwing.
  - `getScrollbarWidth(element)` returns the element's scrollbar width (`offsetWidth - clientWidth`).
  - `isNodeList` returns `false` for array-like plain objects.
  - `listenLoaded` called after the `DOMContentLoaded` event still runs its handler (asynchronously).
  - `getOffset` no longer subtracts the element's own scroll position, only its offset parents'.
- Updated dependencies [[`113cd75`](https://github.com/knitkode/kit/commit/113cd754ba6cf9497752643541defcceebf34a95), [`89e3ba6`](https://github.com/knitkode/kit/commit/89e3ba66f33f8b5c8b7ecc2350d5dadbfd6bc143), [`b131ad6`](https://github.com/knitkode/kit/commit/b131ad61ba1956a5efb1f2a0ad00c76870da8899)]:
  - @knitkode/utils@3.0.1

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

### Patch Changes

- Updated dependencies [[`2f0b11e`](https://github.com/knitkode/kit/commit/2f0b11e8cb991b8ef06bbd8851beac2756652a06)]:
  - @knitkode/utils@3.0.0
