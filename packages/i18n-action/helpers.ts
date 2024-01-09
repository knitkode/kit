import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import * as core from "@actions/core";
import { glob } from "glob";
import { format } from "prettier";

type IndexedLocale = {
  path: string;
  code: string;
};

type IndexedFile = {
  path: string;
  locale: string;
  data: { [key: string]: any };
};

export async function getLocalesFolders(options: { root: string }) {
  const { root } = options;

  const folders = (
    await glob("*", {
      cwd: root,
      withFileTypes: true,
      // onlyDirectories: true,
      dot: false,
    })
  )
    .filter((folder) => folder.isDirectory())
    .map((path) => path.relative());

  const output: IndexedLocale[] = folders.map((locale) => ({
    path: join(root, locale),
    code: locale,
  }));

  return output;
}

type GenerateDataOutput = {
  files: IndexedFile[];
};

export async function generateData(options: {
  root: string;
  output: string;
}): Promise<GenerateDataOutput> {
  const { root, output } = options;
  const outputDir = join(root, dirname(output));
  const outputPath = join(root, `${output}.json`);

  const locales = await getLocalesFolders({ root });

  core.info(`Current path: ${root}`);
  core.info(`Found locales: ${locales.map((l) => l.code).join(", ")}`);
  core.info(`Output data path: ${outputPath}`);

  const dataOutput: GenerateDataOutput = { files: [] };

  await Promise.all(
    locales.map(async (locale) => {
      const jsonFiles = await glob("**/*.json", {
        cwd: locale.path,
      });

      await Promise.all(
        jsonFiles.map(async (relativePath) => {
          const fullPath = join(locale.path, relativePath);
          const rawContent = await readFile(fullPath, "utf8");
          const data = JSON.parse(rawContent);
          const path = relativePath;
          // const lastModified = await lastModified(filepath);

          if (rawContent) {
            dataOutput.files.push({ path, data, locale: locale.code });
          }
        }),
      );
    }),
  );

  core.info(`Found ${dataOutput.files.length} JSON files`);

  // console.log("generateData: outputDir", outputDir, "outputPath", outputPath);
  await mkdir(outputDir, { recursive: true });
  await writeFile(outputPath, JSON.stringify(dataOutput /* , null, 2 */));

  return dataOutput;
}

/**
 * Some translations keys won't be used directly and should be omitted
 * from the generated types, e.g. the plural versions of the same string.
 */
const filterTranslationKey = (key: string) =>
  key.endsWith("_one") || key.endsWith("_zero") || key.endsWith("_other");

function getType(
  value: string | string[] | object | object[],
  options: {} = {},
) {
  let out = "";
  let primitiveType = "";

  if (typeof value === "boolean") {
    primitiveType = "boolean";
  } else if (typeof value === "string") {
    primitiveType = "string";
  }

  if (primitiveType) {
    out += primitiveType + ";";
  } else if (!value) {
    out += "";
  } else if (Array.isArray(value)) {
    const firstValue = value[0];
    out += `${getType(firstValue, options)}[];`;
  } else if (typeof value === "object") {
    out += "{";
    for (const _key in value) {
      const key = _key as keyof typeof value;
      if (!filterTranslationKey(key)) {
        const single = value[key];
        out += `'${key}': ${getType(single, options)}`;
      }
    }
    out += "};";
  }

  // adjust syntax
  out = out.replace(/;\[\];/g, "[];");
  out = out.replace(/;+/g, ";");

  return out;
}

export async function generateTypes(options: {
  root: string;
  output: string;
  defaultLocale: string;
  files: IndexedFile[];
}) {
  const { root, output, defaultLocale, files } = options;
  const defaultLocaleFiles = files.filter((f) => f.locale === defaultLocale);
  const outputDir = join(root, dirname(output));
  const outputPath = join(root, output);
  const header = `
/**
 * Auto-generated on ${new Date().toISOString()}
 */
declare namespace Koine {
  interface Translations {
`;
  const footer = `
  }
}
`;
  let outputContent = header;

  for (let i = 0; i < defaultLocaleFiles.length; i++) {
    const { path, data } = defaultLocaleFiles[i];
    const namespace = path.replace(".json", "");

    outputContent += `"${namespace}": ${getType(data)}\n`;
  }

  outputContent += footer;

  outputContent = await format(outputContent, {
    parser: "typescript",
  });

  // console.log("generateTypes: outputDir", outputDir, "outputPath", outputPath);
  await mkdir(outputDir, { recursive: true });
  await writeFile(outputPath, outputContent);
}

export async function generate(options: {
  root: string;
  defaultLocale: string;
  outputData: string;
  outputTypes: string;
}) {
  const { root, defaultLocale, outputData, outputTypes } = options;

  const data = await generateData({
    root,
    output: outputData,
  });

  await generateTypes({
    root,
    output: outputTypes,
    files: data.files,
    defaultLocale,
  });
}
