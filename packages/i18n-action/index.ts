import * as core from "@actions/core";
import { getData, writeFs, writeSummary } from "@koine/i18n/codegen";
import { Git } from "./git.js";

const cwd = process.cwd();

const main = async () => {
  const repo = process.env["GITHUB_REPOSITORY"] as `${string}/${string}`;
  const ref = process.env["GITHUB_REF"] as `refs/heads/${string}`;
  const branch = ref.replace("refs/heads/", "");
  const sourceUrl = `https://github.com/${repo}/blob/${branch}`;

  const defaultLocale = core.getInput("defaultLocale");
  const hideDefaultLocaleInUrl =
    core.getInput("hideDefaultLocaleInUrl") === "false" || true;
  const config = { defaultLocale, hideDefaultLocaleInUrl };

  const data = await getData({ fs: { cwd }, ...config });

  await Promise.all([
    writeFs(data, {
      output: core.getInput("output_fs") || ".github/fs.json",
    }),
    writeSummary(data, {
      outputJson:
        core.getInput("output_summary_json") || ".github/summary.json",
      outputMarkdown:
        core.getInput("output_summary_md") || ".github/summary.md",
      sourceUrl,
    }),
  ]);

  core.info(`Found locales: ${data.config.locales.join(", ")}`);
  core.info(`Found ${data.fs.translationFiles.length} JSON files`);
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
