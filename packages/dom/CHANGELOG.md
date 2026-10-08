# @knitkode/dom

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
