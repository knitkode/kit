# kit

[![CI](https://github.com/knitkode/kit/actions/workflows/ci.yml/badge.svg)](https://github.com/knitkode/kit/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/knitkode/kit/blob/main/LICENSE)

Opinionated, tree-shakeable TypeScript libraries for building web apps fast, published under the [`@knitkode`](https://www.npmjs.com/org/knitkode) npm scope.

| Package                                  | Version                                                                                                    | Description                                                                         |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| [`@knitkode/utils`](./packages/utils)     | [![npm](https://img.shields.io/npm/v/@knitkode/utils)](https://www.npmjs.com/package/@knitkode/utils)       | Type guards, object and array helpers, case conversion, URL and cookie helpers      |
| [`@knitkode/dom`](./packages/dom)         | [![npm](https://img.shields.io/npm/v/@knitkode/dom)](https://www.npmjs.com/package/@knitkode/dom)           | Selectors, event delegation, scroll and resize listeners, measurements              |
| [`@knitkode/browser`](./packages/browser) | [![npm](https://img.shields.io/npm/v/@knitkode/browser)](https://www.npmjs.com/package/@knitkode/browser)   | URL search and hash navigation, storage clients, gtag, device detection             |
| [`@knitkode/react`](./packages/react)     | [![npm](https://img.shields.io/npm/v/@knitkode/react)](https://www.npmjs.com/package/@knitkode/react)       | Hooks and components, a headless calendar and form antispam                         |
| [`@knitkode/api`](./packages/api)         | [![npm](https://img.shields.io/npm/v/@knitkode/api)](https://www.npmjs.com/package/@knitkode/api)           | Type-safe API client with optional SWR hooks and Next.js helpers                    |
| [`@knitkode/node`](./packages/node)       | [![npm](https://img.shields.io/npm/v/@knitkode/node)](https://www.npmjs.com/package/@knitkode/node)         | File system helpers, dependency version lookup, SWC transforms                      |

## Getting started

Install only the packages you need:

```bash
pnpm add @knitkode/utils
# or: npm install @knitkode/utils
```

Import from the package root, or from a module subpath to load just that module:

```ts
import { debounce, slugify } from "@knitkode/utils";
import { isFullString } from "@knitkode/utils/isFullString";
```

Every package lists its entry points in its own README, and the [API reference](https://knitkode.github.io/kit/) documents every function and type.

### Requirements

- **ES modules only.** Bundlers need no configuration. Node.js can `import` the packages, and `require()` them from 20.19 / 22.12.
- **TypeScript** (types are included): use `"moduleResolution": "bundler"`, `"node16"` or `"nodenext"`.
- `@knitkode/node` requires Node.js 22 or later.

## Versioning and releases

All `@knitkode/*` packages share one version number and follow [semantic versioning](https://semver.org): `@knitkode/react@3.2.0` is meant to be used with `@knitkode/utils@3.2.0`. Every package has its own `CHANGELOG.md`, and each release is listed on the [GitHub releases page](https://github.com/knitkode/kit/releases). Releases are published from CI with [npm provenance](https://docs.npmjs.com/generating-provenance-statements).

Each pull request also gets installable preview builds from [pkg.pr.new](https://pkg.pr.new), linked in a PR comment.

## Upgrading from `@koine/*`

These packages were published as `@koine/*` up to `2.0.0-beta.217`. Internationalization has moved to the separate Koine project. See the [migration guide](./docs/migrating-to-v3.md).

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the development setup and [RELEASING.md](./RELEASING.md) for how releases work.

## License

[MIT](./LICENSE) © Alessandro Sansottera (KnitKode)
