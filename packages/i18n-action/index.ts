import * as core from "@actions/core";
import { i18nWriteTypes } from "@koine/i18n";
import { Git } from "./git.js";

const git = new Git(process.cwd(), async () => {
  const data = await i18nWriteTypes({
    cwd: process.cwd(),
    defaultLocale: core.getInput("default_locale") || "en",
    outputTypes: core.getInput("output_types") || ".github/types.d.ts",
  });

  core.info(`Found locales: ${data.locales.map((l) => l.code).join(", ")}`);
  core.info(`Found ${data.files.length} JSON files per locale`);
});

git
  .run()
  .then(() => git.success())
  .catch((e: Error) => {
    git.error(e);
    console.error(e);
  });
