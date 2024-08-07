import { rm } from "node:fs/promises";
import chalk from "chalk";
import { Command } from "commander";
import ora from "ora";
import { oraOpts } from "./dev.js";
import { self } from "./helpers.js";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type CmdOptions = {};

export const prebuild = () =>
  new Command("prebuild")
    .description("Manage prebuild exports/bundling")
    .argument("<slug>", "The lib package slug (same as folder name)")
    .action(async (arg: string, options: CmdOptions) => {
      // console.log("arg", arg, "options", options);
      if (arg) {
        await manageLibBuildArtifacts(arg, options);
      } else {
        // await Promise.all(
        //   self.libs.map((lib) => manageLibBuildArtifacts(lib.slug, options)),
        // );
      }

      console.log();
    });

async function manageLibBuildArtifacts(libSlug: string, _options: CmdOptions) {
  await Promise.all(
    self.libs
      .filter((lib) => lib.slug === libSlug)
      .map(async (lib) => {
        const suffixText = chalk.dim(`[${lib.name}]`);
        const spinner = ora({
          suffixText,
          text: `Manage build artifacts`,
          ...oraOpts,
        }).start();

        await rm(lib.dist, { recursive: true });

        spinner.succeed();
      }),
  );
}
