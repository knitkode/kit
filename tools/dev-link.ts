/**
 * @file
 *
 * After this you should go to the project you want to to test these local
 * libs and run `pnpm link --global {packageName}
 */
import { exec } from "node:child_process";
import chalk from "chalk";
import { Command } from "commander";
import ora from "ora";
import { type Options, oraOpts } from "./dev.js";
import { self } from "./helpers.js";

export const link = () =>
  new Command("link")
    .description("Link libs with pnpm")
    .action(async (opts: Options) => {
      const spinner = ora({
        text: `Link ${self.libs.length} libs packages...`,
        ...oraOpts,
      });
      spinner.stopAndPersist();
      console.log();
      await linkGlobally(opts);

      console.log();
      ora({
        text: `Now link those packages in one another...`,
        ...oraOpts,
      }).stopAndPersist();
      console.log();
      linkRecursively(opts);
    });

// program
//   .command("link")
//   .description(link.description)
//   .option("-v --verbose")
//   .action(link.action)
//   .parseAsync();

async function linkGlobally(opts: Options) {
  await Promise.all(
    // filter out unnamed packages (unpublishable)
    self.libs
      .filter((lib) => !!lib.name)
      .map(
        (lib) =>
          new Promise<void>((resolve, reject) => {
            const spinner = ora({
              text: `Link ${chalk.bold(lib.name)} globally`,
              indent: 2,
              ...oraOpts,
            });
            if (opts.verbose) {
              spinner.suffixText = ` ran ${chalk.italic(
                `pnpm link --global`,
              )} from ${chalk.italic(lib.pkg.name)}`;
            }

            let cmd = "pnpm link --global";
            if (opts.pkgm === "npm") {
              cmd = "npm link";
            }

            exec(
              cmd,
              {
                cwd: lib.dist,
                // stdio: "inherit",
              },
              (err) => {
                if (err) {
                  spinner.fail();
                  reject();
                } else {
                  spinner.succeed();
                  resolve();
                }
              },
            );
          }),
      ),
  );
}

function linkRecursively(opts: Options) {
  self.libs.forEach((lib) => {
    for (let i = 0; i < lib.internalDeps.length; i++) {
      const depName = lib.internalDeps[i];

      if (lib.name !== depName) {
        const spinner = ora({
          text: `In ${chalk.bold(lib.name)} linking ${chalk.bold(depName)}`,
          indent: 2,
          ...oraOpts,
        });
        if (opts.verbose) {
          spinner.suffixText = `ran ${chalk.italic(
            `pnpm link --global ${depName}`,
          )} from ${chalk.italic(lib.name)}`;
        }

        let cmd = "pnpm link --global";
        if (opts.pkgm === "npm") {
          cmd = "npm link";
        }

        exec(
          `${cmd} ${depName}`,
          {
            cwd: lib.dist,
            // stdio: "inherit",
          },
          (err) => {
            if (err) {
              spinner.fail();
              // reject();
            } else {
              spinner.succeed();
              // resolve();
            }
          },
        );
      }
    }
  });
}
