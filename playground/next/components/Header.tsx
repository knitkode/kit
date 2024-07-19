"use client";

// import { locales, useI18nSwitch, useLocale } from "@/i18n";
import { locales } from "@/i18n/locales";
import { useI18nSwitch } from "@/i18n/useI18nSwitch";
import { useLocale } from "@/i18n/useLocale";
import Link from "next/link";

export type HeaderProps = React.PropsWithChildren<{
  className?: string;
}>;

export const Header = (props: HeaderProps) => {
  const current = useLocale();
  const alternates = useI18nSwitch();

  return (
    <div>
      <small>current: {current}</small>
      {locales.map((locale) => (
        <Link
          key={locale}
          href={alternates[locale] || "#"}
          style={{ padding: "2em", opacity: locale === current ? 0.5 : 1 }}
        >
          {locale}
        </Link>
      ))}
    </div>
  );
};

export default Header;
