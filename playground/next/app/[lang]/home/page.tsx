import { i18nPage } from "@/i18n";

type Props = {};

const next = i18nPage<Props>((_props, _locale) => {
  return {
    route: { id: "home" },
    namespaces: ["~home"],
  };
});

export const generateMetadata = next.metadata(async () => {
  return {
    title: "Playground Next",
  };
});

export default next.render(async function (_props, locale) {
  // console.log("page render locale:", locale);
  return (
    <>
      <h1>Playground next</h1>
      <p>
        i18n.testVar: <span>{i18n.testVar}</span>
      </p>
      <p>i18n.testFn: {i18n.testFn("mate")}</p>
      <p>
        i18n.testRequireT: <span>{i18n.testRequireT("mate")}</span>
      </p>
      <div>
        <h3>i18n.$t... </h3>
        <div>{i18n.t("404.title")}</div>
        <div>{i18n.t("404.seo.title")}</div>
        <div>{i18n.t("404.seo").title}</div>
        <div>{i18n.t("$faq.home").map(f => (
          <p key={f.question}>
            <b>{f.question}</b>
            <em>{f.answer}</em>
          </p>
        ))}</div>
      </div>
      <div>
        <h3>i18n.$tFns... </h3>
        <div>{i18n.$404_title()}</div>
        <div>{i18n.$404_seo_title()}</div>
      </div>
      {/* <p>a_getLocale: {a_getLocale}</p> */}
      {/* <p>testFn: {t("mate")}</p> */}
    </>
  );
});
