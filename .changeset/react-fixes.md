---
"@knitkode/react": patch
---

Fix hooks, components and the calendar:

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
