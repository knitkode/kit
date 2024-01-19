"use client";

/* eslint-disable @typescript-eslint/no-unnecessary-type-constraint */
import type { Translate, TranslateNamespace } from "@koine/i18n";
import getTranslation from "next-translate/getT";

export type GetT = <
  TNamespace extends TranslateNamespace | undefined = undefined,
>(
  locale?: string,
  namespace?: TNamespace,
) => Promise<Translate<TNamespace>>;

/**
 * **NOTE**: To make typescript work nicely here make sure to enable
 * [`resolveJsonModule`](https://www.typescriptlang.org/tsconfig#resolveJsonModule)
 * in your `tsconfig.json` file.
 */
export const getT = getTranslation as GetT;

export default getT;
