import * as core from "@actions/core";
import { Git } from "git.js";
import { generate } from "./helpers.js";

const git = new Git(
  process.cwd(),
  async () =>
    await generate({
      root: process.cwd(),
      defaultLocale: core.getInput("default_locale") || "en",
      outputData: core.getInput("output_data") || ".github/index",
      outputTypes: core.getInput("output_types") || ".github/types.d.ts",
    }),
);

git
  .run()
  .then(() => git.success())
  .catch((e: Error) => {
    git.error(e);
    console.error(e);
  });
