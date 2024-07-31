import { swcCreateTransforms } from "./swcCreateTransforms";

// TODO:FIXME: import the koine packages names froma centralised place, adding
// the packages/libs.ts file to the tsconfig.base.json does not seem to be enough
// import { koineLibs } from "../../libs";
const koineLibs = [
  "api",
  "browser",
  "dom",
  "i18n",
  "next",
  "node",
  "react",
  "utils",
] as const;

/**
 * @see https://www.zhoulujun.net/nextjs/advanced-features/compiler.html#modularize-imports
 *
 * @category tooling
 * @category swc
 */
export const swcTransformsKoine = swcCreateTransforms(koineLibs, "@koine");
// prettier-ignore
// export const swcTransformsKoine = {
//   ...swcCreateTransform("@koine/api"),
//   ...swcCreateTransform("@koine/browser"/* , true */),
//   ...swcCreateTransform("@koine/dom"/* , true */),
//   ...swcCreateTransform("@koine/i18n"),
//   ...swcCreateTransform("@koine/next"),
//   ...swcCreateTransform("@koine/node"),
//   ...swcCreateTransform("@koine/react"),
//   ...swcCreateTransform("@koine/utils"/* , true */),
// }

export default swcTransformsKoine;
