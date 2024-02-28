/**
 * @file
 *
 * Postbuild command to launch for a particular package/lib
 */
import { existsSync } from "node:fs";
import { copyFile, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import chalk from "chalk";
import { Command } from "commander";
import { ensureDir } from "fs-extra";
import { glob, globSync } from "glob";
import ora from "ora";
import { tsAddJsExtension } from "ts-add-js-extension";
import { oraOpts } from "./dev.js";
import { type Lib, editJSONfile, self } from "./helpers.js";

type LibConfig = {
  name: string;
  /**
   * Set to explicit `"none"` to delete the key/value if found
   */
  type?: "none" | "module" | "commonjs";
  /**
   * Set to explicit `"none"` to delete the key/value if found
   */
  exports?: "none" | ("esm" | "cjs")[];
  minify?: boolean;
};

type CmdOptions = {
  ext?: boolean;
  cjs?: boolean;
  esm?: boolean;
};

export const postbuild = () =>
  new Command("postbuild")
    .description("Manage postbuild exports/bundling")
    .argument("<slug>", "The lib package slug (same as folder name)")
    .option(
      "-ext --ext",
      "Whether to automatically add the .js extension to relative imports (for esm libs)",
    )
    .option("-c --cjs", "When true build is managed as CommonJs library")
    .option("-e --esm", "When true build is managed as ESM library")
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

async function manageLibBuildArtifacts(libSlug: string, options: CmdOptions) {
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
        const esmPath = join(lib.dist, "esm");
        const cjsPath = join(lib.dist, "cjs");
        const hasEsm = existsSync(esmPath);
        const hasCjs = existsSync(cjsPath);
        let npmignoreContent = [];

        // 1) add js extensions to esm imports
        if (options.ext) {
          await tsAddJsExtension({
            config: {
              dir: hasEsm ? esmPath : lib.dist,
              showChanges: false,
            },
          });
        }

        // 2) move and rename esm files to root
        if (hasEsm) {
          npmignoreContent.push("/esm");
          await Promise.all(
            globSync(esmPath + "/**/*.{js,ts,json}").map(async (filepath) => {
              let rel = relative(esmPath, filepath);
              // if (hasCjs) rel = rel.replace(/\.js$/, ".mjs");
              const dest = join(lib.dist, rel);
              await ensureDir(dirname(dest));
              await copyFile(filepath, dest);
              // await rename(filepath, join(lib.dist, rel));
            }),
          );
          // await rm(esmPath, { recursive: true });
        }

        // 3) move and rename cjs files to root
        // if (hasCjs) {
        //   npmignoreContent.push("/cjs");
        //   await Promise.all(
        //     globSync(cjsPath + "/**/*.{js,ts,json}").map(async (filepath) => {
        //       let rel = relative(cjsPath, filepath);
        //       // if (hasEsm) rel = rel.replace(/\.js$/, ".cjs");
        //       const dest = join(lib.dist, rel);
        //       await ensureDir(dirname(dest));
        //       await copyFile(filepath, dest);
        //       // await rename(filepath, join(lib.dist, rel));
        //     }),
        //   );
        //   // await rm(cjsPath, { recursive: true });
        // }

        // 4) write lib exports
        // await writeLibExports(lib, options, hasEsm, hasCjs);
        await writeLibEsmExports(lib, options);

        // 5) write npmignore
        if (npmignoreContent.length) {
          await writeFile(
            join(lib.dist, ".npmignore"),
            npmignoreContent.join("\n"),
          );
        }

        spinner.succeed();
      }),
  );
}

function getLibExport(
  options: CmdOptions,
  hasEsm: boolean,
  hasCjs: boolean,
  name?: string,
  path?: string,
) {
  name = name ? `./${name}` : ".";
  const obj: {
    import?: string;
    require?: string;
    default?: string /*  types: string; */;
  } = {
    /* 
    types: exportPath.replace(/\.js$/, ".d.ts"),
   */
  };
  path = path ? path : "./index.js";

  if (hasCjs || hasEsm) {
    if (hasCjs) {
      obj.require = path.replace(/^\.\//, "./cjs/");
      // obj.require = path;

      // if (hasEsm) {
      //   obj.require = path.replace(/\.js$/, ".cjs");
      // }
    }

    if (hasEsm) {
      obj.import = path;

      // if (hasCjs) {
      //   obj.import = path.replace(/\.js$/, ".mjs");
      // }
    }
  }

  return { name, obj };
}

async function writeLibExports(
  lib: Lib,
  options: CmdOptions,
  hasEsm: boolean,
  hasCjs: boolean,
) {
  if (!hasEsm && !hasCjs) {
    await editJSONfile(lib.dist, "package.json", (data) => {
      delete data.exports;
      delete data.main;
      delete data.type;
    });
    return;
  }

  const paths = await glob(lib.dist + "/**/*.{js,scss}", {
    ignore: [
      // ignore build artifacts
      lib.dist + "/cjs/**/*",
      lib.dist + "/esm/**/*",
      // ignore executables
      lib.dist + "/bin/*.js",
      // root index is already exported by `exports: { ".": { import: "./index.js" } }`
      lib.dist + "/index.js",
      // ignore "private" files prefixed with `_` (local convention)
      lib.dist + "/_*.js",
    ],
  });

  const pathsToExports = paths
    .map((fileOrFolderPath) => {
      const dir = relative(lib.dist, fileOrFolderPath);
      return dir;
    })
    .sort();

  // console.log(`${lib.name}:`, pathsToExports);

  const defaultExp = getLibExport(options, hasEsm, hasCjs);
  const exports = pathsToExports.reduce(
    (map, path) => {
      const isScssFile = path.endsWith(".scss");
      const name = isScssFile
        ? path
        : path.replace(/\.js$/, "").replace(/\/index$/, "");
      const exp = getLibExport(options, hasEsm, hasCjs, name, `./${path}`);
      map[exp.name] = exp.obj;

      return map;
    },
    {
      [defaultExp.name]: defaultExp.obj,
    } as Record<string, object>,
  );

  await editJSONfile(lib.dist, "package.json", (data) => {
    if (hasEsm) {
      // if (!hasCjs) {
      //   data.type = "module";
      // }
      data.type = "module";
    }

    if (hasCjs) {
      data.main = "./cjs/index.js";
      // data.main = "./index.js";
      // data.main = hasEsm ? "./index.cjs" : "./index.js";
    } else {
      delete data.main;
    }

    if (hasEsm) {
      data.module = "./index.js";
      // data.module = hasCjs ? "./index.mjs" : "./index.js";
      // data.module = "./index.js";
    } else {
      delete data.module;
    }

    data.exports = exports;
  });
}

async function writeLibEsmExports(
  lib: Lib,
  options: CmdOptions,
) {
  const paths = await glob(lib.dist + "/**/*.{js,scss}", {
    ignore: [
      // ignore build artifacts
      lib.dist + "/cjs/**/*",
      lib.dist + "/esm/**/*",
      // ignore executables
      lib.dist + "/bin/*.js",
      // root index is already exported by `exports: { ".": { import: "./index.js" } }`
      lib.dist + "/index.js",
      // ignore "private" files prefixed with `_` (local convention)
      lib.dist + "/_*.js",
    ],
  });

  const pathsToExports = paths
    .map((fileOrFolderPath) => {
      const dir = relative(lib.dist, fileOrFolderPath);
      return dir;
    })
    .sort();

  // console.log(`${lib.name}:`, pathsToExports);

  const defaultExp = getLibExport(options, true, false);
  const exports = pathsToExports.reduce(
    (map, path) => {
      const isScssFile = path.endsWith(".scss");
      const name = isScssFile
        ? path
        : path.replace(/\.js$/, "").replace(/\/index$/, "");
      const exp = getLibExport(options, true, false, name, `./${path}`);
      map[exp.name] = exp.obj;

      return map;
    },
    {
      [defaultExp.name]: defaultExp.obj,
    } as Record<string, object>,
  );

  await editJSONfile(lib.dist, "package.json", (data) => {
    data.exports = { ...exports, ...data.exports };
  });
}
