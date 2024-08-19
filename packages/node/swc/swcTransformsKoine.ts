import { swcCreateTransforms } from "./swcCreateTransforms";

// TODO:FIXME: import the koine packages names froma centralised place, adding
// the packages/libs.ts file to the tsconfig.base.json does not seem to be enough
// import { koineLibs } from "../../libs";
const koineLibs = [
  { path: "@koine/api" },
  { path: "@koine/browser", flat: true },
  { path: "@koine/dom", flat: true },
  { path: "@koine/i18n" },
  { path: "@koine/next" },
  { path: "@koine/node" },
  { path: "@koine/react" },
  { path: "@koine/utils", flat: true },
] as const;

/**
 * @see https://www.zhoulujun.net/nextjs/advanced-features/compiler.html#modularize-imports
 *
 * @category tooling
 * @category swc
 */
export const swcTransformsKoine = swcCreateTransforms(koineLibs);

export default swcTransformsKoine;
