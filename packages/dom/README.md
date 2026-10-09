# @knitkode/dom

[![npm](https://img.shields.io/npm/v/@knitkode/dom)](https://www.npmjs.com/package/@knitkode/dom)
[![API reference](https://img.shields.io/badge/docs-API%20reference-blue)](https://knitkode.github.io/kit/modules/_knitkode_dom.html)

Tiny, tree-shakeable DOM helpers: selectors, event listeners and delegation, scroll and resize listeners, element measurements and class/attribute helpers.

## Install

```bash
pnpm add @knitkode/dom
# or: npm install @knitkode/dom
```

## Usage

```ts
import { dom, listen, listenScrollThrottled, on } from "@knitkode/dom";

const button = dom<HTMLButtonElement>("#submit");

// `on` returns a function that removes the listener
const off = on(button, "click", (event) => console.log(event.target));
off();

// delegated listener, works for elements added later too
listen("click", ".card a", (event, link) => console.log(link));

listenScrollThrottled(window, () => console.log(window.scrollY), 100);
```

## Entry points

Import from `@knitkode/dom`, or from one subpath per module, e.g. `@knitkode/dom/on`.

<details>
<summary>All 46 subpaths</summary>

- `@knitkode/dom/addClass`
- `@knitkode/dom/calculateFixedOffset`
- `@knitkode/dom/createElement`
- `@knitkode/dom/dom`
- `@knitkode/dom/domAll`
- `@knitkode/dom/domEach`
- `@knitkode/dom/emitEvent`
- `@knitkode/dom/escapeSelector`
- `@knitkode/dom/exists`
- `@knitkode/dom/forEach`
- `@knitkode/dom/getDataAttr`
- `@knitkode/dom/getDocumentHeight`
- `@knitkode/dom/getHeight`
- `@knitkode/dom/getListeners`
- `@knitkode/dom/getOffset`
- `@knitkode/dom/getOffsetTop`
- `@knitkode/dom/getOffsetTopSlim`
- `@knitkode/dom/getScrollbarWidth`
- `@knitkode/dom/getStyleValue`
- `@knitkode/dom/getVisualBackgroundColor`
- `@knitkode/dom/injectCss`
- `@knitkode/dom/isHidden`
- `@knitkode/dom/isInViewport`
- `@knitkode/dom/isNodeList`
- `@knitkode/dom/isTotallyScrolled`
- `@knitkode/dom/listen`
- `@knitkode/dom/listenLoaded`
- `@knitkode/dom/listenOnce`
- `@knitkode/dom/listenResize`
- `@knitkode/dom/listenResizeDebounced`
- `@knitkode/dom/listenResizeThrottled`
- `@knitkode/dom/listenScroll`
- `@knitkode/dom/listenScrollDebounced`
- `@knitkode/dom/listenScrollThrottled`
- `@knitkode/dom/off`
- `@knitkode/dom/on`
- `@knitkode/dom/once`
- `@knitkode/dom/onClickOutside`
- `@knitkode/dom/removeClass`
- `@knitkode/dom/scrollTo`
- `@knitkode/dom/setDataAttr`
- `@knitkode/dom/setVendorCSS`
- `@knitkode/dom/siblings`
- `@knitkode/dom/toArray`
- `@knitkode/dom/types`
- `@knitkode/dom/unlisten`

</details>

## Requirements

ES modules only, with TypeScript declarations included. Use `"moduleResolution": "bundler"`, `"node16"` or `"nodenext"` in TypeScript projects. See the [repository README](../../README.md#requirements).

## Changelog

See [CHANGELOG.md](./CHANGELOG.md). Upgrading from `@koine/*`? Read the [migration guide](../../docs/migrating-to-v3.md).

## License

[MIT](./LICENSE)
