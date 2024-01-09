import * as core from "@actions/core";
import { generate } from "./helpers.js";

const main = async (): Promise<void> => {
  await generate({
    root: process.cwd(),
    defaultLocale: core.getInput("default_locale") || "en",
    outputData: core.getInput("output_data") || ".github/index",
    outputTypes: core.getInput("output_types") || ".github/types.d.ts",
  });
};

main().catch((e: Error) => {
  core.setFailed(e);
  console.error(e);
});
