// "use client";

// import useTranslation from "next-translate/useTranslation";
// // import I18nContext from "next-translate/context";
// import { useMemo } from "react";
// import type {
//   TranslateDefault,
//   TranslateNamespace,
//   TranslateNamespaced,
//   TranslationAtPathFromNamespace,
//   TranslationOptions,
//   TranslationQuery,
//   TranslationsDictionary,
//   TranslationsPaths,
// } from "@koine/i18n";

// /**
//  * Wrap `next-translate` useTranslations for type safety and adds TranslationShortcut
//  * as second/thir argument.
//  *
//  * @see https://github.com/vinissimus/next-translate/issues/513#issuecomment-779826418
//  *
//  * About the typescript support for translation strings see:
//  * - https://github.com/vinissimus/next-translate/issues/721
//  *
//  * **NOTE**: To make typescript work nicely here make sure to enable
//  * [`resolveJsonModule`](https://www.typescriptlang.org/tsconfig#resolveJsonModule)
//  * in your `tsconfig.json` file.
//  */
// export function useT(): TranslateDefault;
// export function useT<TNamespace extends TranslateNamespace>(
//   namespace: TNamespace,
// ): TranslateNamespaced<TNamespace>;
// export function useT<TNamespace extends TranslateNamespace>(
//   namespace?: TNamespace,
// ) {
//   // const { t } = useContext(I18nContext);
//   const t = useTranslation().t;
//   const tMemoized = useMemo(
//     () =>
//       function <
//         TPath extends TranslationsPaths<TranslationsDictionary[TNamespace]>,
//       >(
//         s: TPath,
//         q?: TranslationQuery,
//         o?: TranslationOptions,
//       ): TranslationAtPathFromNamespace<TNamespace, TPath> {
//         return t(
//           namespace ? `${namespace}:${s}` : `${s}`,
//           q === "obj" || q === "" ? null : q,
//           q === "obj" || o === "obj"
//             ? { returnObjects: true }
//             : q === "" || o === ""
//               ? { fallback: "" }
//               : o,
//         ) as TranslationAtPathFromNamespace<TNamespace, TPath>;
//         // ) as TReturn extends (undefined | never | unknown) ? TranslateReturn<TranslationQuery, TranslationOptions> : TReturn;
//         // );
//       },
//     [t, namespace],
//   );
//   return tMemoized;
// }

// export default useT;

// // Instead of wrapping the `useTranslation` hook from [`next-translate`](https://github.com/vinissimus/next-translate/blob/master/src/useTranslation.tsx)
// // we might just rewrite it with our custom implementation but the `_context`
// // to use is not exposed by the library...
// // import { useContext/* , useMemo */ } from "react"
// // // import wrapTWithDefaultNs from "next-translate";
// // import I18nContext from "next-translate/context";
// // import type { Translate } from "@koine/i18n";
// // export default function useT(_defaultNS?: string) {

// //   const ctx = useContext(I18nContext);
// //   return ctx.t as Translate;
// //   // return useMemo(
// //   //   () => ({
// //   //     ...ctx,
// //   //     t: wrapTWithDefaultNs(ctx.t, defaultNS),
// //   //   }),
// //   //   [ctx, defaultNS]
// //   // )
// // }
