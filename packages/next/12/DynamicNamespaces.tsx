"use client";

import type { TranslateNamespace } from "@koine/i18n";
import type { DynamicNamespacesProps as BaseDynamicNamespacesProps } from "next-translate";
import BaseDynamicNamespaces from "next-translate/DynamicNamespaces";

export type DynamicNamespacesProps = Omit<
  BaseDynamicNamespacesProps,
  "namespaces"
> & {
  namespaces: TranslateNamespace[];
};

/**
 * **NOTE**: To make typescript work nicely here make sure to enable
 * [`resolveJsonModule`](https://www.typescriptlang.org/tsconfig#resolveJsonModule)
 * in your `tsconfig.json` file.
 */
export const DynamicNamespaces = BaseDynamicNamespaces as (
  props: DynamicNamespacesProps,
) => ReturnType<typeof BaseDynamicNamespaces>;

export default DynamicNamespaces;
