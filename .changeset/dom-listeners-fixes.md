---
"@knitkode/dom": patch
---

Fix the event helpers and a few DOM utilities:

- The unbind functions returned by `on`, `listenScroll`, `listenScrollDebounced` and `listenScrollThrottled` remove listeners added with capture (they used to do nothing), and `once(el, type, fn, true)` fires only once.
- `unlisten` matches callbacks by reference instead of by their source code, removes only the matching listener (it used to drop every listener of a type that had just one), and can remove a `listenOnce` listener given its original callback. A new function with the same body as the registered one no longer removes it.
- Delegated listeners: a `listenOnce` callback no longer makes the next listener skip the event, and listeners with a selector no longer throw for events fired on `window` or `document`.
- `getListeners` returns copies, mutating them no longer changes the registry.
- `addClass` and `removeClass` called without a class name do nothing instead of throwing.
- `getScrollbarWidth(element)` returns the element's scrollbar width (`offsetWidth - clientWidth`).
- `isNodeList` returns `false` for array-like plain objects.
- `listenLoaded` called after the `DOMContentLoaded` event still runs its handler (asynchronously).
- `getOffset` no longer subtracts the element's own scroll position, only its offset parents'.
