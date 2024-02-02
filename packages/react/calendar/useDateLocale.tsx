import type { Locale } from "date-fns";
import { useEffect, useState } from "react";

/**
 * Dynamically import the date-fns correct locale
 *
 * Inspired by:
 * @see https://robertmarshall.dev/blog/dynamically-import-datefns-locale-mui-datepicker-localization/
 */
export let useDateLocale = (locale?: string, defaultLocale = "en") => {
  const [data, setData] = useState<Locale>();
  const [current, setCurrent] = useState(defaultLocale);
  // const [ready, setReady] = useState(false);

  // If the user changes the locale listen to the change and import the locale that is now required.
  useEffect(() => {
    const importLocaleFile = async () => {
      // This webpack option stops all of the date-fns files being imported and chunked.
      // NB: this makes unnecessary numerous webpack chunks in applications
      // that do not even use this hook, so we comment out the webpack dynamic
      // import and its magic comment
      // const localeToSet = await import(
      //   /FIXME: * webpackMode: "lazy", webpackChunkName: "df-[index]", webpackExclude: /_lib/ */
      //   `date-fns/locale/${locale}/index.js`,
      // );
      const localeToSet = await import(`date-fns/locale/en-US`);
      setCurrent(locale || current);
      setData(localeToSet.enUS);
      // setReady(true);
    };

    // If the locale has not yet been loaded.
    if (locale !== current) {
      importLocaleFile();
    }
  }, [locale, current]);

  return data;
};
