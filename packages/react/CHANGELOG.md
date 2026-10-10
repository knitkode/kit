# @knitkode/react

## 3.0.1

### Patch Changes

- [`113cd75`](https://github.com/knitkode/kit/commit/113cd754ba6cf9497752643541defcceebf34a95) Thanks [@kuus](https://github.com/kuus)! - `decodeForm` only reads the encoded input names and ignores the plain (honeypot) ones explicitly, instead of relying on `decode` mangling them. It keeps working with the `decode` of this release, which leaves non encoded text as it is.

- [`f1c0e3a`](https://github.com/knitkode/kit/commit/f1c0e3a7e23acc7af5f35e48b34b0554d07ac35e) Thanks [@kuus](https://github.com/kuus)! - Fix hooks, components and the calendar:
  
  - `classed` keeps the text after the last interpolation, and its ref and event handlers are typed with the element type.
  - `createUseMediaQueryWidth` supports the `"@md"` shorthand (same as `"@min-md"`).
  - `extendComponent` applies its default props on React 19.
  - `useMeasure` reports the size changes of every instance's element, `useFixedOffset` computes the offset with the given selector, and both work where `ResizeObserver` is missing.
  - `useSmoothScroll` subtracts the fixed offset for numeric targets too, and never scrolls below 0.
  - `NoJs` swaps `no-js` for `js` without breaking the other classes. Its inline script changed: update its hash if a Content-Security-Policy allows it by hash.
  - `Meta` allows zooming when `zoom` is set.
  - `useFocus` returns a tuple and accepts the element type, `useInterval` accepts a `null` delay.
  - Calendar: hiding a calendar no longer hides the events of the other ones, the default components no longer pass `$` props to the DOM (no more React warnings), multi-day events keep free rows (no more overlaps and duplicate keys), timed events show on their last day, all-day Google events show on the right day in every timezone, events of calendars missing from `calendarsMap` are shown instead of crashing, and the default navigation title is visible.
  - `useCalendar` merges the given `events` with the fetched ones, calls `onError` for failing calendars, shows the Google calendar names in `calendarsMap`, switches view from the displayed range, keeps the clicked event on "today" and no longer mutates the given calendars and dates.
- Updated dependencies [[`a04e3ff`](https://github.com/knitkode/kit/commit/a04e3ffbd88d6ee664b3e22546c2e6d66bdd851a), [`113cd75`](https://github.com/knitkode/kit/commit/113cd754ba6cf9497752643541defcceebf34a95), [`89e3ba6`](https://github.com/knitkode/kit/commit/89e3ba66f33f8b5c8b7ecc2350d5dadbfd6bc143), [`b131ad6`](https://github.com/knitkode/kit/commit/b131ad61ba1956a5efb1f2a0ad00c76870da8899)]:
  - @knitkode/dom@3.0.1
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

- [`2f0b11e`](https://github.com/knitkode/kit/commit/2f0b11e8cb991b8ef06bbd8851beac2756652a06) Thanks [@kuus](https://github.com/kuus)! - `KitCalendarDaygridTable` passes `key` to its week rows and day cells as a prop of its own instead of inside spread props, fixing React's "A props object containing a "key" prop is being spread into JSX" warning. The `TableBodyCell` and `TableBodyCellDate` slot props now declare the `children` they receive.
- Updated dependencies [[`2f0b11e`](https://github.com/knitkode/kit/commit/2f0b11e8cb991b8ef06bbd8851beac2756652a06)]:
  - @knitkode/dom@3.0.0
  - @knitkode/utils@3.0.0
