import { i18nServer } from "@/i18n/server";
import { type Metadata } from "next";
import { Header } from "../../components";

const i18nLayout = i18nServer.layout();

export const generateStaticParams = i18nLayout.generateStaticParams;

export async function generateMetadata(): Promise<Metadata> {
  const t = await i18nServer.getT("404");
  const to = await i18nServer.getTo();

  return {
    title: {
      template: "%s | Koine",
      default: t("seo.title"),
    },
    openGraph: {
      type: "website",
      siteName: "Koine",
      url: to("home"),
    },
  };
}

export default i18nLayout.default((props) => {
  const { children, i18nHtmlAttrs } = props;

  return (
    <html {...i18nHtmlAttrs}>
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
});
