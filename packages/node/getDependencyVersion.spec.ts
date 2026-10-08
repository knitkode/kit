import { readFileSync } from "node:fs";
import { getDependencyVersion } from "./getDependencyVersion";

const readInstalledVersion = (name: string) =>
  (
    JSON.parse(
      readFileSync(
        new URL(`./node_modules/${name}/package.json`, import.meta.url),
        "utf-8",
      ),
    ) as { version: string }
  ).version
    .split(".")
    .map((part) => parseInt(part, 10));

describe("getDependencyVersion", () => {
  // `glob` resolves to `dist/commonjs/index.js`, next to a nested
  // `package.json` that only holds `{ "type": "commonjs" }`
  const glob = readInstalledVersion("glob");

  it("returns the full version of a dual package", () => {
    expect(getDependencyVersion("glob")).toEqual(glob);
  });

  it("returns the major, minor and patch numbers", () => {
    expect(getDependencyVersion("glob", "major")).toBe(glob[0]);
    expect(getDependencyVersion("glob", "minor")).toBe(glob[1]);
    expect(getDependencyVersion("glob", "patch")).toBe(glob[2]);
  });

  it("supports scoped packages and subpath specifiers", () => {
    expect(getDependencyVersion("@knitkode/utils/slugify")).toEqual(
      readInstalledVersion("@knitkode/utils"),
    );
  });

  it("returns -1 for packages that cannot be resolved", () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    expect(getDependencyVersion("not-an-installed-package")).toEqual([
      -1, -1, -1,
    ]);
    expect(getDependencyVersion("not-an-installed-package", "major")).toBe(-1);
    expect(consoleError).toHaveBeenCalled();

    consoleError.mockRestore();
  });
});
