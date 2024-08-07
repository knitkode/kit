import { readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { EOL } from "node:os";
import { basename, join } from "node:path";
import { fileURLToPath } from "node:url";
import json from "comment-json";
import { globSync } from "glob";
import type { PackageJson } from "type-fest";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const require = createRequire(import.meta.url);

export type Lib = (typeof libs)[number];

const pkg = require(join(__dirname, "../package.json")) as PackageJson;

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const scope = pkg.name!.split("/")[0];

const libs = (globSync(join(__dirname, "../packages/*")) || []).map((src) => {
  const slug = basename(src);
  const dist = join(__dirname, "../dist/packages/", slug);
  let pkg = {} as PackageJson;
  let deps = {};
  let internalDeps: string[] = [];
  try {
    pkg = require(join(src, "/package.json")) as PackageJson;
    const {
      dependencies = {},
      devDependencies = {},
      peerDependencies = {},
    } = pkg;
    deps = { ...dependencies, ...devDependencies, ...peerDependencies };
    internalDeps = Object.keys(deps).filter((depName) =>
      depName.startsWith(scope),
    );
  } catch (_e) {
    // nothing
  }

  return {
    src,
    dist,
    slug,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    name: pkg.name!,
    pkg,
    deps,
    internalDeps,
  };
});

export const self = {
  scope,
  pkg,
  libs,
  libsMap: libs.reduce(
    (map, lib) => {
      map[lib.name] = lib;
      return map;
    },
    {} as Record<Lib["name"], Lib>,
  ),
};

export async function editJSONfile(
  root: string | string[],
  fileName: string,
  transformer: (data: any) => void,
) {
  const roots = Array.isArray(root) ? root : [root];

  await Promise.all(
    roots.map(async (root) => {
      const filePath = join(root, fileName);

      try {
        const fileContent = await readFile(filePath, { encoding: "utf-8" });
        // let fileJSON = JSON.parse(fileContent);
        let fileJSON = json.parse(fileContent);
        transformer(fileJSON);
        // const newContent = JSON.stringify(fileJSON, null, 2);
        const newContent = json.stringify(fileJSON, null, 2) + EOL;

        if (newContent) {
          await writeFile(filePath, newContent);
        }
      } catch (_e) {
        console.log("editJSONfile failed for:", filePath);
        // throw e;
        return;
      }
    }),
  );
}
