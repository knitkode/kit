# Migrating from `@koine/*` 2.x to `@knitkode/*` 3.0

kit 3.0 is the first release published under the `@knitkode` npm scope. The packages are the same ones you used as `@koine/*` up to `2.0.0-beta.217`, renamed, rebuilt as ESM-only and stripped of everything related to internationalization.

Most projects only need to do steps 1 and 2.

## 1. Switch packages

| 2.x               | 3.0                  |
| ----------------- | -------------------- |
| `@koine/api`      | `@knitkode/api`      |
| `@koine/browser`  | `@knitkode/browser`  |
| `@koine/dom`      | `@knitkode/dom`      |
| `@koine/node`     | `@knitkode/node`     |
| `@koine/react`    | `@knitkode/react`    |
| `@koine/utils`    | `@knitkode/utils`    |
| `@koine/i18n`     | not part of kit      |
| `@koine/next`     | not part of kit      |

Internationalization now lives in the separate Koine project, so `@koine/i18n` and `@koine/next` have no `@knitkode/*` successor.

Replace the dependencies (with your package manager of choice):

```bash
pnpm remove @koine/utils @koine/react
pnpm add @knitkode/utils @knitkode/react
```

Then update the imports, for example with GNU sed:

```bash
grep -rl "@koine/" src | xargs sed -i 's#@koine/\(api\|browser\|dom\|node\|react\|utils\)#@knitkode/\1#g'
```

Subpath imports keep the same shape: `@koine/utils/isArray` becomes `@knitkode/utils/isArray`.

## 2. ESM only

The packages now ship ES modules and `.d.ts` declarations only, there are no CommonJS builds anymore.

- **Bundlers** (Next.js, Vite, webpack, Rollup, esbuild, Turbopack): no changes needed.
- **Node.js**: use `import`. `require()` of the packages still works on Node.js 20.19+ and 22.12+, which load ES modules synchronously.
- **TypeScript**: set `moduleResolution` to `bundler`, `node16` or `nodenext`. The legacy `node` (`node10`) resolution ignores the `exports` field and won't find the types.
- **Jest**: run it with ESM support, or move to [Vitest](https://vitest.dev).

Only the documented entry points can be imported: the package root and one subpath per module (see each package README). Internal files, such as `@koine/react/calendar/CalendarLegend` or the old `*.cjs.js` / `*.esm.js` files, are no longer reachable: import from the public entry point (`@knitkode/react/calendar`) instead.

## 3. Renamed exports

The last references to the old brand are gone from the public API:

| Package                | 2.x                                                         | 3.0                                                     |
| ---------------------- | ----------------------------------------------------------- | ------------------------------------------------------- |
| `@knitkode/react`      | `KoineComponent`, `KoineComponentProps`                     | `KitComponent`, `KitComponentProps`                     |
| `@knitkode/react`      | `KoineCalendarDaygridNav`, `KoineCalendarDaygridNavProps`   | `KitCalendarDaygridNav`, `KitCalendarDaygridNavProps`   |
| `@knitkode/react`      | `KoineCalendarDaygridTable`, `KoineCalendarDaygridTableProps` | `KitCalendarDaygridTable`, `KitCalendarDaygridTableProps` |
| `@knitkode/react`      | `KoineCalendarDaygridCellProps`                             | `KitCalendarDaygridCellProps`                           |
| `@knitkode/react`      | `KoineCalendarLegend`, `KoineCalendarLegendProps`           | `KitCalendarLegend`, `KitCalendarLegendProps`           |
| `@knitkode/api/typings` | global `Koine.Api.*` namespace                             | global `Kit.Api.*` namespace                            |
| `@knitkode/node/swc`   | `swcTransformsKoine`                                        | `swcTransformsKit`                                      |

`swcTransformsKit` only lists the `@knitkode/*` packages, it no longer includes the i18n and Next.js ones.

## 4. Removed entry points

| 2.x                                     | 3.0                            |
| --------------------------------------- | ------------------------------ |
| `@koine/api/swr/createSwrApi`           | `@knitkode/api/swr`            |
| `@koine/api/swr-mutation/createSwrApi`  | `@knitkode/api/swr-mutation`   |
| `@koine/utils/without`                  | removed (it was an empty module) |

## 5. Type fixes

These fixes may surface new, correct, type errors in your code:

- `@knitkode/dom` exports the `EventCallback` and `ListenEvent` types from its root. In 2.x the declarations of `listen`, `listenOnce`, `unlisten` and `getListeners` referenced them without shipping them.
- `@knitkode/api/typings` resolves under `node16` and `nodenext` module resolution.

## Global typings

As before, the ambient types of `@knitkode/utils` and `@knitkode/api` are opt-in:

```ts
/// <reference types="@knitkode/utils/typings" />
/// <reference types="@knitkode/api/typings" />
```
