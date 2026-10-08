# @knitkode/node

[![npm](https://img.shields.io/npm/v/@knitkode/node)](https://www.npmjs.com/package/@knitkode/node)

Node.js helpers: file system utilities (write, find-up, symlinks, temporary moves), installed dependency version lookup and SWC modularize-imports transforms for `@knitkode/*` packages.

Requires Node.js 22 or later.

## Install

```bash
pnpm add @knitkode/node
# or: npm install @knitkode/node
```

## Usage

```ts
import { fsWrite, getDependencyVersion } from "@knitkode/node";

await fsWrite("./generated/routes.ts", "export const routes = [];");

getDependencyVersion("react"); // e.g. [19, 1, 0]
getDependencyVersion("react", "major"); // e.g. 19
```

## Entry points

Import from `@knitkode/node`, or from one subpath per module, e.g. `@knitkode/node/fsWrite`. The SWC helpers live in `@knitkode/node/swc`.

<details>
<summary>All 8 subpaths</summary>

- `@knitkode/node/fsFindUpSync`
- `@knitkode/node/fsMoveAndRestoreTemporaryPaths`
- `@knitkode/node/fsMoveAndRestoreTemporaryPathsSync`
- `@knitkode/node/fsSymlink`
- `@knitkode/node/fsWrite`
- `@knitkode/node/fsWriteSync`
- `@knitkode/node/getDependencyVersion`
- `@knitkode/node/swc`

</details>

## Requirements

ES modules only, with TypeScript declarations included. Use `"moduleResolution": "bundler"`, `"node16"` or `"nodenext"` in TypeScript projects. See the [repository README](../../README.md#requirements).

## Changelog

See [CHANGELOG.md](./CHANGELOG.md). Upgrading from `@koine/*`? Read the [migration guide](../../docs/migrating-to-v3.md).

## License

[MIT](./LICENSE)
