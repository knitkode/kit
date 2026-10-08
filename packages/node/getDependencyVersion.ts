import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname } from "node:path";
import { fsFindUpSync } from "./fsFindUpSync";

const require = createRequire(import.meta.url);

type PackageJson = { name?: string; version?: string };

/**
 * `@scope/name/sub/path` -> `@scope/name`, `name/sub/path` -> `name`
 */
const getPackageName = (specifier: string) =>
  specifier
    .split("/")
    .slice(0, specifier.startsWith("@") ? 2 : 1)
    .join("/");

/**
 * Walk up from the resolved entry file to the dependency's own `package.json`.
 * Dual packages often ship nested ones (e.g. `dist/commonjs/package.json`)
 * that only set the module `type`, so the first one found is not enough.
 */
function readDependencyVersion(dependencyName: string) {
  const packageName = getPackageName(dependencyName);
  let fallbackVersion: string | undefined;
  let packageJsonPath = fsFindUpSync("package.json", {
    cwd: dirname(require.resolve(dependencyName)),
  });

  while (packageJsonPath) {
    const { name, version } = (JSON.parse(
      readFileSync(packageJsonPath, "utf-8"),
    ) || {}) as PackageJson;

    if (name === packageName) return version;
    // e.g. installed under an npm alias, whose `name` differs from the specifier
    fallbackVersion ??= version;

    packageJsonPath = fsFindUpSync("package.json", {
      cwd: dirname(dirname(packageJsonPath)),
    });
  }

  return fallbackVersion;
}

export function getDependencyVersion(dependencyName: string): number[];
export function getDependencyVersion(
  dependencyName: string,
  type: "major" | "minor" | "patch",
): number;
export function getDependencyVersion(
  dependencyName: string,
  type?: "major" | "minor" | "patch",
): number[] | number {
  let numbers: number[] | null = null;
  try {
    const version = readDependencyVersion(dependencyName);

    if (version) {
      numbers = version.split(".").map((part) => parseInt(part, 10));
    }
  } catch (error) {
    console.error(`Could not resolve version for ${dependencyName}:`, error);
  }

  if (type === "major") return numbers ? numbers[0] : -1;
  if (type === "minor") return numbers ? numbers[1] : -1;
  if (type === "patch") return numbers ? numbers[2] : -1;
  return numbers || [-1, -1, -1];
}

export default getDependencyVersion;
