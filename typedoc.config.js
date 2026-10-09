// @ts-check
import { readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { OptionDefaults } from "typedoc";

const packages = ["api", "browser", "dom", "node", "react", "utils"];

/**
 * Top level source files missing from a package's `exports` (internal modules,
 * test fixtures, unreleased work): the docs document only importable paths.
 */
const notExported = packages.flatMap((name) => {
  const dir = resolve("packages", name);
  const { exports } = JSON.parse(
    readFileSync(join(dir, "package.json"), "utf8"),
  );
  const entries = new Set(
    Object.values(exports)
      .filter((path) => typeof path === "string" && path.startsWith("./dist/"))
      .map((path) => path.slice("./dist/".length, -".js".length)),
  );

  return readdirSync(dir)
    .filter((file) => /^[^.]+(\.nested)?\.tsx?$/.test(file))
    .filter((file) => !entries.has(file.replace(/\.tsx?$/, "")))
    .map((file) => join(dir, file));
});

/** @type {Partial<import("typedoc").TypeDocOptions>} */
export default {
  name: "kit",
  entryPointStrategy: "packages",
  entryPoints: packages.map((name) => `packages/${name}`),
  packageOptions: {
    // every top level module is a public entry point, like in the build
    entryPoints: ["*.{ts,tsx}"],
    exclude: [
      "**/*.d.ts",
      "**/*.spec.ts",
      "**/*.spec.tsx",
      "**/*.config.ts",
      ...notExported,
    ],
    // custom JSDoc tags used in the sources, rendered as their own sections
    blockTags: [
      ...OptionDefaults.blockTags,
      "@borrows",
      "@pure",
      "@resources",
      "@usage",
      "@use",
    ],
    // public signatures use some types that are not exported by name, see the
    // "not included in the documentation" warnings when enabling this
    validation: { notExported: false },
    externalSymbolLinkMappings: {
      typescript: {
        fetch: "https://developer.mozilla.org/docs/Web/API/Window/fetch",
      },
    },
  },
  readme: "README.md",
  projectDocuments: ["docs/migrating-to-v3.md"],
  treatWarningsAsErrors: true,
  out: "api-docs",
  includeVersion: true,
  excludeInternal: true,
  excludePrivate: true,
  githubPages: true,
  sourceLinkTemplate:
    "https://github.com/knitkode/kit/blob/{gitRevision}/{path}#L{line}",
  navigationLinks: {
    GitHub: "https://github.com/knitkode/kit",
    npm: "https://www.npmjs.com/org/knitkode",
  },
};
