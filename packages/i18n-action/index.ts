import * as core from "@actions/core";
import { writeSummary } from "@koine/i18n/generate/writeSummary";
import { Git } from "./git.js";

const cwd = process.cwd();

const main = async () => {
  const repo = process.env["GITHUB_REPOSITORY"] as `${string}/${string}`;
  const ref = process.env["GITHUB_REF"] as `refs/heads/${string}`;
  const branch = ref.replace("refs/heads/", "");
  const sourceUrl = `https://github.com/${repo}/blob/${branch}`;

  const defaultLocale = core.getInput("default_locale") || "en";
  const hideDefaultLocaleInUrl =
    core.getInput("hide_default_locale_in_url") === "false" || true;
  const i18nConfig = { defaultLocale, hideDefaultLocaleInUrl };

  // const data = await write({
  //   cwd,
  //   ...i18nConfig,
  //   source: {
  //     output: core.getInput("output_source") || ".github/.source",
  //     adapter: (core.getInput("adapater") || "next-translate") as I18nGenerate.BuiltinAdapters,
  //   },
  //   summary: {
  //     sourceUrl,
  //     outputJson:
  //       core.getInput("output_summary_json") || ".github/summary.json",
  //     outputMarkdown:
  //       core.getInput("output_summary_md") || ".github/summary.md",
  //   }
  // });
  const data = await writeSummary({
    cwd,
    ...i18nConfig,
    sourceUrl,
    outputJson: core.getInput("output_summary_json") || ".github/summary.json",
    outputMarkdown: core.getInput("output_summary_md") || ".github/summary.md",
  });

  core.info(`Found locales: ${data.locales.join(", ")}`);
  core.info(`Found ${data.files.length} JSON files per locale`);
};

const git = new Git(cwd, main);

git
  .run()
  .then(() => git.success())
  .catch((e: Error) => {
    git.error(e);
    console.error(e);
  });

// main()
//   .catch((e: Error) => {
//     console.error(e);
//   });
