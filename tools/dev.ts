import chalk from "chalk";
import { Option, program } from "commander";
import { libs } from "./dev-libs.js";
import { link } from "./dev-link.js";
import { postbuild } from "./dev-postbuild.js";
import { prebuild } from "./dev-prebuild.js";
import { publish } from "./dev-publish.js";

export const oraOpts = {
  prefixText: chalk.dim("dev"),
  color: "magenta" as const,
};

export type Options = {
  pkgm: "pnpm" | "npm";
  verbose?: boolean;
  // watch?: boolean;
};

program
  .name("dev")
  .description("Internal dev cli")

  .addOption(
    new Option("-p, --pkgm <name>", "package manager")
      .choices(["pnpm", "npm"])
      .default("pnpm"),
  )
  .option("-v --verbose")
  .addCommand(libs())
  .addCommand(link())
  .addCommand(prebuild())
  .addCommand(postbuild())
  .addCommand(publish())
  .parseAsync();
