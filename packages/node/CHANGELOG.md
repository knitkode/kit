# @knitkode/node

## 3.0.1

### Patch Changes

- [`1ad3640`](https://github.com/knitkode/kit/commit/1ad3640499d3efd829475f90409d56f19b503573) Thanks [@kuus](https://github.com/kuus)! - `getDependencyVersion` accepts a `{ from }` option with the directory to resolve the dependency from, e.g. `getDependencyVersion("next", { from: "./apps/web" })` or `getDependencyVersion("next", "major", { from })`. By default it now resolves from the current working directory instead of from where `@knitkode/node` is installed, so it finds the project's own dependencies with strict `node_modules` layouts such as pnpm's.

- [`113cd75`](https://github.com/knitkode/kit/commit/113cd754ba6cf9497752643541defcceebf34a95) Thanks [@kuus](https://github.com/kuus)! - Fix several helpers:
  
  - `fsMoveAndRestoreTemporaryPaths` and `fsMoveAndRestoreTemporaryPathsSync` move the paths out of the destination while the callback runs (they used to copy them), always restore them, even when the callback throws or a path is missing, and run the callback once when there are no paths (it used to run twice).
  - `fsFindUpSync` also searches the `stopAt` directory and the file system root.
  - `fsWrite` and `fsWriteSync` only drop the leading blank lines, keeping the indentation of the first line.
  - `swcCreateTransform` maps root imports of nested libraries without a double slash (`@org/ui/Button`, it used to give `@org/ui//Button`), and `swcTransformsKit` only rewrites root imports, the sub paths of the `@knitkode/*` packages being entry points already.
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

- [`2f0b11e`](https://github.com/knitkode/kit/commit/2f0b11e8cb991b8ef06bbd8851beac2756652a06) Thanks [@kuus](https://github.com/kuus)! - `getDependencyVersion` reads the dependency's own `package.json` instead of the first one above its entry file. Dual packages that ship nested `package.json` files, like `glob`'s `dist/commonjs/package.json`, no longer return `-1`. Subpath specifiers such as `react-dom/client` resolve to their package version.
- Updated dependencies [[`2f0b11e`](https://github.com/knitkode/kit/commit/2f0b11e8cb991b8ef06bbd8851beac2756652a06)]:
  - @knitkode/utils@3.0.0
