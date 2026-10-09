import { swcCreateTransforms } from "./swcCreateTransforms";

// every `@knitkode/*` package only exports top level modules (nested folders
// are internal), so only their root imports can be rewritten
const kitLibs = [
  { path: "@knitkode/api", flat: true },
  { path: "@knitkode/browser", flat: true },
  { path: "@knitkode/dom", flat: true },
  { path: "@knitkode/node", flat: true },
  { path: "@knitkode/react", flat: true },
  { path: "@knitkode/utils", flat: true },
] as const;

/**
 * @see https://www.zhoulujun.net/nextjs/advanced-features/compiler.html#modularize-imports
 *
 * @category tooling
 * @category swc
 */
export const swcTransformsKit = swcCreateTransforms(kitLibs);

export default swcTransformsKit;
