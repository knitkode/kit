# @knitkode/react

[![npm](https://img.shields.io/npm/v/@knitkode/react)](https://www.npmjs.com/package/@knitkode/react)

React hooks and components: window size, scroll and measure hooks, polymorphic component helpers, `<Meta>`/`<FaviconTags>`/`<NoJs>`, a headless daygrid calendar and a form antispam helper.

## Install

```bash
pnpm add @knitkode/react
# or: npm install @knitkode/react
```

`react` (18 or 19) is a peer dependency. The calendar also needs `date-fns` and `react-swipeable`, the forms helpers need `@kuus/yup`: install them only if you use those entry points.

## Usage

```tsx
import { useScrollThreshold, useWindowSize } from "@knitkode/react";

export function Header() {
  const [width] = useWindowSize(100);
  const isScrolled = useScrollThreshold(80);

  return <header data-scrolled={isScrolled}>{width > 768 ? "Desktop" : "Mobile"}</header>;
}
```

## Entry points

Import from `@knitkode/react`, from `@knitkode/react/calendar` and `@knitkode/react/forms`, or from one subpath per module, e.g. `@knitkode/react/useWindowSize`.

<details>
<summary>All 31 subpaths</summary>

- `@knitkode/react/calendar`
- `@knitkode/react/classed`
- `@knitkode/react/createUseMediaQueryWidth`
- `@knitkode/react/extendComponent`
- `@knitkode/react/FaviconTags`
- `@knitkode/react/forms`
- `@knitkode/react/mergeRefs`
- `@knitkode/react/Meta`
- `@knitkode/react/NoJs`
- `@knitkode/react/Polymorphic`
- `@knitkode/react/types`
- `@knitkode/react/useAsyncFn`
- `@knitkode/react/useFirstMountState`
- `@knitkode/react/useFixedOffset`
- `@knitkode/react/useFocus`
- `@knitkode/react/useInterval`
- `@knitkode/react/useIsomorphicLayoutEffect`
- `@knitkode/react/useKeyUp`
- `@knitkode/react/useMeasure`
- `@knitkode/react/useMountedState`
- `@knitkode/react/useNavigateAway`
- `@knitkode/react/usePrevious`
- `@knitkode/react/usePreviousRef`
- `@knitkode/react/useScrollPosition`
- `@knitkode/react/useScrollThreshold`
- `@knitkode/react/useScrollTo`
- `@knitkode/react/useSmoothScroll`
- `@knitkode/react/useSpinDelay`
- `@knitkode/react/useTraceUpdate`
- `@knitkode/react/useUpdateEffect`
- `@knitkode/react/useWindowSize`

</details>

## Requirements

ES modules only, with TypeScript declarations included. Use `"moduleResolution": "bundler"`, `"node16"` or `"nodenext"` in TypeScript projects. See the [repository README](../../README.md#requirements).

## Changelog

See [CHANGELOG.md](./CHANGELOG.md). Upgrading from `@koine/*`? Read the [migration guide](../../docs/migrating-to-v3.md).

## License

[MIT](./LICENSE)
