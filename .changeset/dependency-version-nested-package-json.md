---
"@knitkode/node": patch
---

`getDependencyVersion` reads the dependency's own `package.json` instead of the first one above its entry file. Dual packages that ship nested `package.json` files, like `glob`'s `dist/commonjs/package.json`, no longer return `-1`. Subpath specifiers such as `react-dom/client` resolve to their package version.
