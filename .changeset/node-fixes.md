---
"@knitkode/node": patch
---

Fix several helpers:

- `fsMoveAndRestoreTemporaryPaths` and `fsMoveAndRestoreTemporaryPathsSync` move the paths out of the destination while the callback runs (they used to copy them), always restore them, even when the callback throws or a path is missing, and run the callback once when there are no paths (it used to run twice).
- `fsFindUpSync` also searches the `stopAt` directory and the file system root.
- `fsWrite` and `fsWriteSync` only drop the leading blank lines, keeping the indentation of the first line.
- `swcCreateTransform` maps root imports of nested libraries without a double slash (`@org/ui/Button`, it used to give `@org/ui//Button`), and `swcTransformsKit` only rewrites root imports, the sub paths of the `@knitkode/*` packages being entry points already.
