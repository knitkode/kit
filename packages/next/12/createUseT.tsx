"use client";

// import useTranslation from "next-translate/useTranslation";
// import I18nContext from "next-translate/context";
import type { Translate } from "next-translate";
import { useMemo } from "react";
import type {
  TranslateNamespace,
  TranslationAtPathFromNamespace,
  TranslationOptions,
  TranslationQuery,
  TranslationsDictionary,
  TranslationsPaths,
} from "@koine/i18n";

/**
 * Wrap `next-translate` useTranslations for type safety and adds TranslationShortcut
 * as second/thir argument.
 *
 * @see https://github.com/vinissimus/next-translate/issues/513#issuecomment-779826418
 *
 * About the typescript support for translation strings see:
 * - https://github.com/vinissimus/next-translate/issues/721
 *
 * **NOTE**: To make typescript work nicely here make sure to enable
 * [`resolveJsonModule`](https://www.typescriptlang.org/tsconfig#resolveJsonModule)
 * in your `tsconfig.json` file.
 */
export const createUseT =
  (useNextTranslateTranslation: () => { t: Translate }) =>
  <TNamespace extends TranslateNamespace>(namespace?: TNamespace) => {
    const t = useNextTranslateTranslation().t;
    const tMemoized = useMemo(
      () =>
        function <
          TPath extends TranslationsPaths<TranslationsDictionary[TNamespace]>,
          TReturn = TranslationAtPathFromNamespace<TNamespace, TPath>,
        >(s: TPath, q?: TranslationQuery, o?: TranslationOptions): TReturn {
          return t(
            namespace ? `${namespace}:${s}` : `${s}`,
            q === "obj" || q === "" ? null : q,
            q === "obj" || o === "obj"
              ? { returnObjects: true }
              : q === "" || o === ""
                ? { fallback: "" }
                : o,
          ) as TReturn;
          // ) as TReturn extends (undefined | never | unknown) ? TranslateReturn<TranslationQuery, TranslationOptions> : TReturn;
          // );
        },
      [t, namespace],
    );
    return tMemoized;
  };

export default createUseT;
