/**
 * @file
 *
 */
import { execSync } from "node:child_process";
// import { rm } from "node:fs/promises";
// import { join } from "node:path";
import type { Config as _SWCConfig } from "@swc/core";
import chalk from "chalk";
import { Command, Option } from "commander";
import ora from "ora";
import { oraOpts } from "./dev.js";
import { editJSONfile, self } from "./helpers.js";

type Options = {
  version: string;
  tag: "next" | "latest";
  dry?: boolean;
};

export const publish = () =>
  new Command("publish")
    .description(`Publish current builds in ${chalk.bold("dist/packages")}`)
    .option(
      `-d --dry", "Run ${chalk.bold("npm publish")} in ${chalk.italic(
        "dry",
      )} mode`,
    )
    .option("-v --version", "version to publish", self.pkg.version)
    .addOption(
      new Option("-t --tag", "npm tag").choices(["latest", "latest"]).default(
        "latest",
        // nx suggests this instead...:
        // "next",
        // `Default ${chalk.bold("next")} so we won't publish the ${chalk.bold(
        //   "latest"
        // )} tag by accident.`
      ),
    )
    .action(async (opts: Options) => {
      // filter out private or unnamed packages (unpublishable)
      const publishableLibs = self.libs.filter(
        (lib) => !!lib.name && !lib.pkg.private,
      );

      await Promise.all(
        publishableLibs.map(async (lib) => {
          const suffixText = chalk.dim(`[${lib.name}]`);
          const spinner = ora({
            suffixText,
            text: `Update versions in package.json`,
            ...oraOpts,
          }).start();

          await editJSONfile(lib.dist, "package.json", (data) => {
            // // FIXME: bug in nx, https://github.com/nrwl/nx/issues/14735, buildableProjectDepsInPackageJsonType is not respected
            // data.peerDependencies = data.dependencies;
            // data.dependencies = {};

            // bump version
            data.version = opts.version;

            // bump internal dependencies versions
            // NOTE: this should be done by nx I think...
            data.dependencies = data.dependencies || {};

            lib.internalDeps.forEach((depName) => {
              // // FIXME: this is related to the hack we need to do just above https://github.com/nrwl/nx/issues/14735
              // delete data.peerDependencies[depName];

              data.dependencies[depName] = opts.version;
            });
          });
          spinner.succeed();
        }),
      );

      await Promise.all(
        self.libs
          // filter out private or unnamed packages (unpublishable)
          .filter((lib) => !!lib.name && !lib.pkg.private)
          .map(
            (lib) =>
              new Promise<void>((resolve, reject) => {
                const suffixText = chalk.dim(`[${lib.name}]`);
                const spinner = ora({
                  suffixText,
                  text: `Publishing...`,
                  ...oraOpts,
                }).start();

                let command = `npm publish --access public --tag ${opts.tag}`;
                if (opts.dry) {
                  command += " --dry-run";
                }

                try {
                  execSync(command, {
                    cwd: lib.dist,
                    stdio: "inherit",
                  });
                  spinner.succeed(`Published ${chalk.bold(opts.version)}!`);
                  resolve();
                } catch (e) {
                  spinner.fail("Failed to publish");
                  reject(e);
                }
              }),
          ),
      );

      console.log();
    });
