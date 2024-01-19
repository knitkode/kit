"use client";

import {
  type ToRoute,
  type ToRouteDynamic,
  type ToRouteDynamicParams,
  type ToRouteStatic,
  createTo,
} from "@koine/i18n";
import { useT } from "./useT";

/**
 * @borrows [`conditionally-typed rest parameters` SO answer](https://stackoverflow.com/a/70491602/1938970)
 */
export const createUseTo =
  <TLocales extends string[] | readonly string[]>(
    useLocaleHook: () => TLocales[number],
    _locales: TLocales,
    defaultLocale: TLocales[number],
    hideDefaultLocaleInUrl?: boolean,
  ) =>
  () => {
    const t = useT("~");
    const locale = useLocaleHook();
    const _to = createTo(_locales, defaultLocale, hideDefaultLocaleInUrl);
    return <TRoute extends ToRoute>(
      ...args: TRoute extends ToRouteDynamic
        ? [routeId: TRoute, routeParams: ToRouteDynamicParams<TRoute>]
        : TRoute extends ToRouteStatic
          ? [routeId: ToRouteStatic]
          : never
    ) => {
      const [routeId, routeParams] = args;
      return routeParams
        ? _to(locale, t, routeId as ToRouteDynamic, routeParams)
        : _to(locale, t, routeId as ToRouteStatic);
    };
  };

export default createUseTo;
