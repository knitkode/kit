import * as core from "@actions/core";
import { i18nWriteSummary, i18nWriteTypes } from "@koine/i18n";

// import { Git } from "./git.js";

const cwd = process.cwd();

const main = async () => {
  const defaultLocale = core.getInput("default_locale") || "en";

  const data = await i18nWriteTypes({
    cwd,
    defaultLocale,
    outputTypes: core.getInput("output_types") || ".github/types.d.ts",
  });

  await i18nWriteSummary({
    cwd,
    sourceUrl: "https://git.org/org/repo/branch",
    outputJson: core.getInput("output_summary_json") || ".github/summary.json",
    outputMarkdown: core.getInput("output_summary_md") || ".github/summary.md",
    defaultLocale,
  });

  core.info(`Found locales: ${data.locales.map((l) => l.code).join(", ")}`);
  core.info(`Found ${data.files.length} JSON files per locale`);
};

// const git = new Git(cwd, main);

// git
//   .run()
//   .then(() => git.success())
//   .catch((e: Error) => {
//     git.error(e);
//     console.error(e);
//   });

main()
  .then(() => core.info("Successed"))
  .catch((e: Error) => {
    console.error(e);
  });
