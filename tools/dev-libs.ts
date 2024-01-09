/**
 * @file
 */
import type {
  AmdConfig,
  CommonJsConfig,
  Es6Config,
  NodeNextConfig,
  UmdConfig,
  Config as _SWCConfig,
} from "@swc/core";
import chalk from "chalk";
import { Command } from "commander";
import ora from "ora";
// import type { TsConfigJson } from "type-fest";
import { oraOpts } from "./dev.js";
import { type Lib as LibBase, editJSONfile, self } from "./helpers.js";

const libsConfig: LibConfig[] = [
  { name: "api", type: "module", minify: false },
  { name: "browser", type: "module", minify: false },
  { name: "dom", type: "module", minify: false },
  { name: "i18n", type: "module", minify: false },
  { name: "react", type: "module", minify: false },
  { name: "next", type: "module", minify: false },
  { name: "utils", type: "module", minify: false },
];

// FIXME: to fix in swc? just exclude `SystemjsConfig` because it does not extends `BaseModuleConfig`
type SWCConfig = Omit<_SWCConfig, "module"> & {
  module: Es6Config | NodeNextConfig | CommonJsConfig | UmdConfig | AmdConfig;
};

export const libs = () =>
  new Command("libs")
    .description("Manage libs build configuration")
    .action(async () => {
      await Promise.all(
        libsConfig.map(mergeLibData).map(async (lib) => {
          const suffixText = chalk.dim(`[${lib.name}]`);
          const spinner = ora({
            suffixText,
            text: `Tweak build configuration files`,
            ...oraOpts,
          }).start();

          await setLibOptions(lib);

          spinner.succeed();
        }),
      );

      console.log();
    });

type LibConfig = {
  name: string;
  /**
   * Set to explicit `"none"` to delete the key/value if found
   */
  type?: "none" | "module" | "commonjs";
  minify?: boolean;
};

type Lib = LibBase & LibConfig;

function overrideByLibType<T, L extends NonNullable<LibConfig["type"]>>(
  option: T,
  libType: L,
  override: Record<L, NonNullable<T>>,
) {
  option = override[libType];
  return override[libType];
}

async function setLibOptions(lib: Lib) {
  await editJSONfile(lib.src, ".swcrc", (data: SWCConfig) => {
    data.module = data.module || ({} as SWCConfig["module"]);

    if (lib.type !== "none") {
      data.module.type = overrideByLibType(data.module.type, lib.type, {
        module: "es6",
        commonjs: "commonjs",
      });

      data.module.noInterop = overrideByLibType(
        data.module.noInterop,
        lib.type,
        {
          module: true,
          commonjs: false,
        },
      );

      // FIXME: this is not yet supported officially?
      // overrideByLibType(data.module.importInterop, lib.type, {
      //   module: "none",
      //   commonjs: "node"
      // });
      delete data.module.importInterop;
    }

    data.minify = !!lib.minify;

    // exclude some `.d.ts` files otherwise they get compield into empty `.d.js`
    // file, if we want to include those files in the publishable build they
    // need to be defined in the `options.assets` of the package's `project.json`
    // particularly we are interested in "./typings.d.ts" and "./globals.d.ts"
    const exclude = Array.isArray(data.exclude)
      ? data.exclude
      : [data.exclude || ""];
    data.exclude = Array.from(new Set([...exclude, "./*\\.d.ts"]));
  });

  // await editJSONfile(lib.src, "tsconfig.json", (data: TsConfigJson) => {
  //   if (lib.type && lib.type !== "none") {
  //     data.compilerOptions = data.compilerOptions || {};
  //     data.compilerOptions.module = overrideByLibType(
  //       data.compilerOptions.module,
  //       lib.type,
  //       {
  //         module: "ESNext",
  //         commonjs: "CommonJS",
  //       },
  //     );
  //   }
  // });
}

function mergeLibData(lib: LibConfig): Lib {
  const libBase = self.libsMap[`${self.scope}/${lib.name}`];
  if (libBase) {
    return { ...libBase, ...lib };
  }
  throw Error(`Trying to process unexisting lib "${lib.name}"`);
}
