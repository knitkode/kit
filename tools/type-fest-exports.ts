import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import packageJson from "../packages/utils/package.json" with { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const REGEX_NAMED_EXPORTS = /export type {([^}]+)}/gm;
const REGEX_STAR_EXPORTS = /export type \* from '(.+)'/gm;
const REGEX_EXPORT_TYPE = /export (type|interface) (.*?)(<| =)/gm;

async function run() {
  const version = packageJson.dependencies["type-fest"].replace(/\^|\~/, "");
  const baseUrl = "https://raw.githubusercontent.com/sindresorhus/type-fest";
  const destination = resolve(__dirname, "../packages/utils/index.ts");
  const content = readFileSync(destination, "utf-8");
  let exports: string[] = [];

  const res = await fetch(`${baseUrl}/refs/tags/v${version}/index.d.ts`);
  const text = await res.text();
  const starExports = text.matchAll(REGEX_STAR_EXPORTS);

  if (starExports) {
    for (const match of starExports) {
      const modulePath = match[1];
      const moduleUrl = `${baseUrl}/refs/tags/v${version}/${modulePath.replace(/^\.\//, "")}`;
      const moduleRes = await fetch(moduleUrl);
      const moduleText = await moduleRes.text();

      const moduleNamedExports = moduleText.matchAll(REGEX_EXPORT_TYPE);
      if (moduleNamedExports) {
        exports = [
          ...exports,
          ...[...moduleNamedExports]
            .map((m) => m[2].trim())
            .filter((line) => line.length > 0),
        ];
      }
    }
  }

  const namedExports = text.matchAll(REGEX_NAMED_EXPORTS);

  if (namedExports) {
    exports = [
      ...exports,
      ...[...namedExports]
        .map((match) => match[1].trim())
        .flatMap((line) => line.split(",").map((l) => l.trim()))
        .filter((line) => line.length > 0),
    ];
  }

  if (exports.length) {
    const out = content.replace(
      /\/\/ type-fest start[\s\S]*?} from "type-fest";/gm,
      `// type-fest start
/**
 * @borrows type-fest@v${version}
 *
 * These types should not be documented by using [\`excludeExternals\` TypeDoc flag](https://typedoc.org/options/input/#excludeexternals)
 */
export type {
  ${exports.join(",\n  ")}
} from "type-fest";`,
    );

    writeFileSync(destination, out, "utf-8");
  }
}

run();
