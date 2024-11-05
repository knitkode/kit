import { readFileSync } from "node:fs";
import { dirname } from "node:path";
import { fsFindUpSync } from "./fsFindUpSync";

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
    const dependencyPath = require.resolve(dependencyName);
    const packageJsonPath = fsFindUpSync("package.json", {
      cwd: dirname(dependencyPath),
    });

    if (packageJsonPath) {
      const { version } =
        (JSON.parse(readFileSync(packageJsonPath, "utf-8")) as
          | undefined
          | {
              version?: string;
            }) || {};

      if (version) {
        numbers = version.split(".").map((part) => parseInt(part, 10));
      }
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
