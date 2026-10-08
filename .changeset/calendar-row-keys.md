---
"@knitkode/react": patch
---

`KitCalendarDaygridTable` passes `key` to its week rows and day cells as a prop of its own instead of inside spread props, fixing React's "A props object containing a "key" prop is being spread into JSX" warning. The `TableBodyCell` and `TableBodyCellDate` slot props now declare the `children` they receive.
