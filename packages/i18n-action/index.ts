import { getInput, info } from "@actions/core";
import { i18nAction } from "@koine/i18n/action";
import { Git } from "./git.js";

const cwd = process.cwd();

const main = async () => {
  const repo = process.env["GITHUB_REPOSITORY"] as `${string}/${string}`;
  const ref = process.env["GITHUB_REF"] as `refs/heads/${string}`;
  const branch = ref.replace("refs/heads/", "");
  const url = `https://github.com/${repo}/blob/${branch}`;

  const input = await i18nAction({
    cwd,
    url,
    output: {
      input: getInput("output_input") || ".github/input.json",
      summaryJson: getInput("output_summary_json") || ".github/summary.json",
      summaryMarkdown: getInput("output_summary_md") || ".github/summary.md",
    },
  });

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
