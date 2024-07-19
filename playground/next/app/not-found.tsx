import { I18nLayout, defaultLocale, getT } from "@/i18n";

export default async function NotFound() {
  const locale = defaultLocale;
  const t = await getT(defaultLocale, "404");

  return (
    <html lang={locale}>
      <body>
        {/* <I18nLayout locale={locale} namespaces={[]}>
          {t("text")}
        </I18nLayout> */}
        {t("text")}
      </body>
    </html>
  );
}
