import { i18nServer } from "@/i18n/server";
import { type Metadata } from "next";
import { Header } from "../../components";

const layout = i18nServer.layout();

export const generateStaticParams = layout.generateStaticParams;

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

export default layout.default((props) => {
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
