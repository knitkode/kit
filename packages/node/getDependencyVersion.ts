import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { fsFindUpSync } from "./fsFindUpSync";

type PackageJson = { name?: string; version?: string };

type VersionPart = "major" | "minor" | "patch";

export type GetDependencyVersionOptions = {
  /**
   * The directory to resolve the dependency from, usually the root of the
   * project that installed it.
   *
   * @default process.cwd()
   */
  from?: string | URL;
};

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
function readDependencyVersion(dependencyName: string, from: string | URL) {
  const fromDir = resolve(from instanceof URL ? fileURLToPath(from) : from);
  // the file does not need to exist, it only sets where resolution starts
  const require = createRequire(join(fromDir, "noop.js"));
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

/**
 * Get the installed version of a dependency, as `[major, minor, patch]` or as
 * one of those numbers. It returns `-1` values when the dependency cannot be
 * resolved.
 *
 * @example
 * ```ts
 * getDependencyVersion("react"); // e.g. [19, 1, 0]
 * getDependencyVersion("react", "major"); // e.g. 19
 * getDependencyVersion("next", { from: "./apps/web" });
 * ```
 */
export function getDependencyVersion(
  dependencyName: string,
  options?: GetDependencyVersionOptions,
): number[];
export function getDependencyVersion(
  dependencyName: string,
  type: VersionPart,
  options?: GetDependencyVersionOptions,
): number;
export function getDependencyVersion(
  dependencyName: string,
  typeOrOptions?: VersionPart | GetDependencyVersionOptions,
  maybeOptions?: GetDependencyVersionOptions,
): number[] | number {
  const type = typeof typeOrOptions === "string" ? typeOrOptions : undefined;
  const { from = process.cwd() } =
    (typeof typeOrOptions === "object" ? typeOrOptions : maybeOptions) || {};
  let numbers: number[] | null = null;
  try {
    const version = readDependencyVersion(dependencyName, from);

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
