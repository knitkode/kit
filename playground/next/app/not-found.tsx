import { i18nServer } from "@/i18n/server";

const layout = i18nServer.layout({
  locale: i18nServer.defaultLocale,
});

export default layout.default(async (props) => {
  const { i18nHtmlAttrs, I18nScript } = props;
  const t = await i18nServer.getT("404");

  return (
    <html {...i18nHtmlAttrs}>
      <body>
        {I18nScript}
        <span>{t("title")}</span>
      </body>
    </html>
  );
});
