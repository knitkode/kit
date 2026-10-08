import { swcCreateTransforms } from "./swcCreateTransforms";

const kitLibs = [
  { path: "@knitkode/api" },
  { path: "@knitkode/browser", flat: true },
  { path: "@knitkode/dom", flat: true },
  { path: "@knitkode/node" },
  { path: "@knitkode/react" },
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
