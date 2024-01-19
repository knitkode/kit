import { useRouter } from "next/router";

export const createUseLocale =
  <TLocales extends string[] | readonly string[]>(
    _locales: TLocales,
    defaultLocale: TLocales[number],
  ) =>
  () =>
    (useRouter().locale as TLocales[number]) || defaultLocale;

export default createUseLocale;
