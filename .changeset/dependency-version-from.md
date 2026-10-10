---
"@knitkode/node": patch
---

`getDependencyVersion` accepts a `{ from }` option with the directory to resolve the dependency from, e.g. `getDependencyVersion("next", { from: "./apps/web" })` or `getDependencyVersion("next", "major", { from })`. By default it now resolves from the current working directory instead of from where `@knitkode/node` is installed, so it finds the project's own dependencies with strict `node_modules` layouts such as pnpm's.
