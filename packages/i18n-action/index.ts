import { getInput, info } from "@actions/core";
import { i18nCompiler } from "@koine/i18n/compiler";
import { Git } from "./git.js";

const cwd = process.cwd();

const main = async () => {
  const repo = process.env["GITHUB_REPOSITORY"] as `${string}/${string}`;
  const ref = process.env["GITHUB_REF"] as `refs/heads/${string}`;
  const branch = ref.replace("refs/heads/", "");
  const sourceUrl = `https://github.com/${repo}/blob/${branch}`;

  const defaultLocale = getInput("defaultLocale");
  const hideDefaultLocaleInUrl =
    getInput("hideDefaultLocaleInUrl") === "false" || true;
  const config = { defaultLocale, hideDefaultLocaleInUrl };

  const i18n = i18nCompiler({ input: { cwd }, ...config });
  const [input] = await Promise.all([
    i18n.writeInput({
      cwd,
      output: getInput("output_input") || ".github/input.json",
    }),
    i18n.writeSummary({
      cwd,
      outputJson: getInput("output_summary_json") || ".github/summary.json",
      outputMarkdown: getInput("output_summary_md") || ".github/summary.md",
      sourceUrl,
    }),
  ]);

  info(`Found locales: ${input.localesFolders.join(", ")}`);
  info(`Found ${input.translationFiles.length} JSON files`);
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
