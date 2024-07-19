import { I18nLayoutRoot } from "@/i18n";
import "./global.css";

type Props = React.PropsWithChildren;

export default function Layout({ children }: Props) {
  return <I18nLayoutRoot>{children}</I18nLayoutRoot>;
}
