import { existsSync } from "node:fs";
import { join } from "node:path";
import { defineConfig, type UserConfig } from "tsdown";

type KitConfigOptions = {
  /**
   * `node` for packages that only run on Node.js, `neutral` (the default) for
   * everything else (browser, server, edge).
   */
  platform?: "neutral" | "node";
  /**
   * Top level source files (without extension) that must not become a public
   * entry point, e.g. test fixtures or work-in-progress modules.
   */
  exclude?: string[];
};

/**
 * Shared tsdown config for every published `@knitkode/*` package.
 *
 * Every top level `*.ts`/`*.tsx` file of a package is a public entry point
 * (`@knitkode/utils/isArray`, `@knitkode/react/calendar`, ...) and `index.ts` is
 * the package root. Files are emitted unbundled (one output file per source
 * module) as ESM with `.d.ts` declarations, and tsdown writes the matching
 * `exports` map into the package's `package.json`.
 *
 * Files starting with `_` and nested folders are internal: they are compiled
 * because entries import them, but they are not exported.
 */
export function defineKitConfig({
  platform = "neutral",
  exclude = [],
}: KitConfigOptions = {}): UserConfig {
  const cwd = process.cwd();
  const hasTypings = existsSync(join(cwd, "typings.d.ts"));

  return defineConfig({
    entry: [
      "*.ts",
      "*.tsx",
      "!*.d.ts",
      "!*.{spec,test}.{ts,tsx}",
      "!*.config.ts",
      "!_*",
      ...exclude.map((name) => `!${name}.{ts,tsx}`),
    ],
    format: "esm",
    platform,
    target: platform === "node" ? "node22" : "es2022",
    unbundle: true,
    fixedExtension: false,
    hash: false,
    dts: true,
    clean: true,
    copy: hasTypings ? ["typings.d.ts"] : [],
    exports: {
      customExports: (exports) =>
        hasTypings
          ? { ...exports, "./typings": { types: "./dist/typings.d.ts" } }
          : exports,
    },
    publint: true,
    attw: { profile: "esm-only", level: "error" },
    failOnWarn: true,
    // unbundled output keeps every module in its own file, so directives such
    // as "use client" stay at the top of the module that declares them
    suppressWarnings: /MODULE_LEVEL_DIRECTIVE/,
  });
}
