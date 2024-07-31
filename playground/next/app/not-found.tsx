import { i18nServer } from "@/i18n/server";

const i18nNotFound = i18nServer.layout(() => ({}));

export default i18nNotFound.default(async (props) => {
  const { i18nHtmlAttrs } = props;
  const t = await i18nServer.getT("404");

  return (
    <html {...i18nHtmlAttrs}>
      <body>{t("title")}</body>
    </html>
  );
});
