# Contributing

Thanks for helping out! This guide covers the local setup, the repository conventions and what a pull request needs.

## Setup

Requirements: Node.js 22.18+ (24 recommended) and pnpm, whose version is pinned in `package.json` (`corepack enable` picks it up).

```bash
pnpm install
pnpm verify   # lint, build, typecheck and test everything, like CI
```

pnpm only installs dependency versions published at least 3 days ago (`minimumReleaseAge` in `pnpm-workspace.yaml`). If you really need a fresher release, add the package to `minimumReleaseAgeExclude` there.

| Script                     | What it does                                                    |
| -------------------------- | --------------------------------------------------------------- |
| `pnpm build`               | Build every package with [tsdown](https://tsdown.dev) (via Turborepo) |
| `pnpm dev`                 | Rebuild packages on change (`turbo watch build`)                |
| `pnpm test`                | Run the [Vitest](https://vitest.dev) suites                     |
| `pnpm test:coverage`       | Same, with coverage reports in `packages/*/coverage`            |
| `pnpm typecheck`           | Type-check every package, specs included                        |
| `pnpm lint` / `lint:fix`   | Check / fix formatting, lint rules and import order with [Biome](https://biomejs.dev) |
| `pnpm changeset`           | Describe your change for the next release                       |
| `pnpm codegen:type-fest`   | Refresh the `type-fest` re-exports of `@knitkode/utils`          |

Turborepo caches task results, so commands only re-run for packages whose inputs changed. Use `--force` to bypass the cache.

To try a change in another project before it's released, every pull request gets installable [pkg.pr.new](https://pkg.pr.new) builds, linked in a PR comment.

## Repository layout

```
packages/
  api/ browser/ dom/ node/ react/ utils/   published as @knitkode/<name>
  test/                                     private test helpers
tools/tsdown.ts                             build config shared by all packages
docs/                                       guides (e.g. migrations)
```

Each package is built from its own folder:

- every top level `*.ts`/`*.tsx` file is a **public entry point**: `packages/utils/slugify.ts` is `@knitkode/utils/slugify`, `index.ts` is the package root;
- files starting with `_` and files in subfolders are **internal**: they are compiled but not exported;
- `*.spec.ts` files are tests, colocated with the code they test.

The build regenerates the `exports` field of each `package.json`. When you add, rename or remove a top level module, commit the updated `package.json` too: CI fails if it is out of date. To keep a top level file private, add it to the `exclude` list in that package's `tsdown.config.ts`.

On every build tsdown also runs [publint](https://publint.dev) and [Are the types wrong?](https://arethetypeswrong.github.io), so packaging mistakes fail the build.

## Conventions

- **ESM only**, no CommonJS globals: use `import.meta.url` and `createRequire` instead of `__dirname` and `require`.
- **Tree-shaking first**: one module per file, no side effects at import time (every package is `"sideEffects": false`), and nothing that touches `window` or `document` at module level. Modules must import on the server.
- **Nullable inputs**: transformative functions like `truncate` or `titleCase` should accept `undefined` and `null` wherever possible.
- **Logging**: `console.log` is for local debugging only. Public messages use `console.info`, `console.warn` or `console.error` with the format `[@knitkode/{package}:{function}] details`, and are usually wrapped in `if (process.env["NODE_ENV"] === "development") { ... }` so they disappear from production builds.
- **React compound components** use the dot notation (`Dialog.Root`), following the [Headless UI technique](https://github.com/tailwindlabs/headlessui/blob/main/packages/%40headlessui-react/src/components/dialog/dialog.tsx).
- **Exported types**: every type that appears in a public signature must be exported, not marked `@internal`, or the published declarations break.

## Commits and pull requests

- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org) (`feat:`, `fix:`, `chore:`, ...), checked by a git hook. Another hook formats staged files with Biome.
- Add a changeset to every pull request that changes a published package:

  ```bash
  pnpm changeset
  ```

  Pick the bump type with [semver](https://semver.org) in mind and write the summary for users of the package: it ends up verbatim in the changelog. A bot comment on the pull request tells you whether one is present. Changes that don't need a release (docs, tests, tooling) can skip it, or use `pnpm changeset --empty`.

See [RELEASING.md](./RELEASING.md) for what happens after merging.

## Prior art

`@knitkode/utils` encapsulates and re-exports ideas from libraries that offer full TypeScript support, tree-shaking and docs in source comments:

- [dhmk-utils](https://github.com/dhmk083/dhmk-utils)
- the [mesqueeb](https://github.com/mesqueeb) `*-anything` libraries: [merge](https://github.com/mesqueeb/merge-anything), [filter](https://github.com/mesqueeb/filter-anything), [case](https://github.com/mesqueeb/case-anything), [nestify](https://github.com/mesqueeb/nestify-anything), [compare](https://github.com/mesqueeb/compare-anything), [copy](https://github.com/mesqueeb/copy-anything), [flatten](https://github.com/mesqueeb/flatten-anything) and [fast-sort](https://github.com/mesqueeb/fast-sort)
- [type-fest](https://github.com/sindresorhus/type-fest), [ts-toolbelt](https://github.com/millsp/ts-toolbelt) and [ts-essentials](https://github.com/ts-essentials/ts-essentials) for utility types
- [chakra-ui utils](https://github.com/chakra-ui/chakra-ui/blob/main/packages/utils/src) and [1loc.dev](https://1loc.dev) for inspiration

Worth a look: [dlv](https://www.npmjs.com/package/dlv), [dset](https://github.com/lukeed/dset), [just](https://github.com/angus-c/just), [ts-is-present](https://github.com/robertmassaioli/ts-is-present) and the utilities in [TypeScript's core](https://github.com/microsoft/TypeScript/blob/main/src/compiler/core.ts).
