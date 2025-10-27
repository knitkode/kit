import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import packageJson from "../packages/utils/package.json" with { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const REGEX_GET_EXPORTS = /export type {([^}]+)}/gm;

async function run() {
  const version = packageJson.dependencies["type-fest"].replace(/\^|\~/, "");
  const res = await fetch(
    `https://raw.githubusercontent.com/sindresorhus/type-fest/refs/tags/v${version}/index.d.ts`,
  );
  const text = await res.text();

  const destination = resolve(__dirname, "../packages/utils/index.ts");
  const content = readFileSync(destination, "utf-8");

  let exports = `// type-fest start (v${version})
/**
 * These types should not be documented by using [\`excludeExternals\` TypeDoc flag](https://typedoc.org/options/input/#excludeexternals)
 */\n`;
  exports += "export type {\n  ";

  const matches = text.matchAll(REGEX_GET_EXPORTS);
  if (matches) {
    const lines = matches
      .toArray()
      .map((match) => match[1].trim())
      .flatMap((line) => line.split(",").map((l) => l.trim()))
      .filter((line) => line.length > 0);

    exports += `${lines.join(",\n  ")}`;
  }

  exports += `\n} from "type-fest";\n// end type-fest`;

  const out = content.replace(
    /\/\/ type-fest start[\s\S]*?\/\/ end type-fest/gm,
    exports,
  );

  writeFileSync(destination, out, "utf-8");
}

run();
