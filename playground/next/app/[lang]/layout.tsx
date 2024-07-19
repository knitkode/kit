import { type I18n, I18nLayout, getT, locales, to } from "@/i18n";
import { type Metadata } from "next";
import { Header } from "../../components";

// import { i18nNext } from '@/i18n';

// const { generateStaticParams, generateMetadata, Layout } = i18nNext.layout();

// export {
//   generateStaticParams,
//   generateMetadata,
//   Layout as default
// }

export const generateStaticParams = () => {
  return locales.map((locale) => ({ lang: locale }));
};

export async function generateMetadata(props: I18n.Props): Promise<Metadata> {
  // const locale = I18nLayout.getLocale();
  // const t = await getT("common");
  return {
    // title: {
    //   template: "%s | Kooine",
    //   default: t("seo.title"),
    // },
    // description: t("seo.description"),
    // openGraph: {
    //   type: "website",
    //   siteName: "Kooine",
    //   url: to("home", locale),
    //   locale,
    //   alternateLocale: locales.filter((l) => l !== locale),
    // },
  };
}

export default async function Layout(
  props: I18n.Props<React.PropsWithChildren>,
) {
  const { children } = props;

  return (
    <html lang={I18nLayout.getLocale()}>
      <body>
        <I18nLayout namespaces={[]}>
          <Header />
          {children}
        </I18nLayout>
      </body>
    </html>
  );
}
