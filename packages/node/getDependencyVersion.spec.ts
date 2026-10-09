import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
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

  describe("resolving from another directory", () => {
    let project: string;

    // a project with a dual package whose entry file sits next to a nested
    // `package.json` holding only `{ "type": "commonjs" }`
    beforeAll(() => {
      project = mkdtempSync(join(tmpdir(), "kit-dependency-version-"));
      const pkg = join(project, "node_modules", "fixture-dual");
      mkdirSync(join(pkg, "dist", "commonjs"), { recursive: true });
      writeFileSync(
        join(pkg, "package.json"),
        JSON.stringify({
          name: "fixture-dual",
          version: "4.5.6",
          main: "./dist/commonjs/index.js",
        }),
      );
      writeFileSync(
        join(pkg, "dist", "commonjs", "package.json"),
        JSON.stringify({ type: "commonjs" }),
      );
      writeFileSync(
        join(pkg, "dist", "commonjs", "index.js"),
        "module.exports = {};\n",
      );
    });

    afterAll(() => {
      rmSync(project, { recursive: true, force: true });
    });

    it("resolves from the `from` directory", () => {
      expect(getDependencyVersion("fixture-dual", { from: project })).toEqual([
        4, 5, 6,
      ]);
    });

    it("accepts a file URL and a version part", () => {
      expect(
        getDependencyVersion("fixture-dual", "minor", {
          from: pathToFileURL(project),
        }),
      ).toBe(5);
    });

    it("resolves from the current working directory by default", () => {
      const cwd = vi.spyOn(process, "cwd").mockReturnValue(project);

      expect(getDependencyVersion("fixture-dual")).toEqual([4, 5, 6]);
      expect(getDependencyVersion("fixture-dual", "patch")).toBe(6);

      cwd.mockRestore();
    });

    it("does not find dependencies outside of the resolved directory", () => {
      const consoleError = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      // the default working directory is this package, which can't see the
      // fixture project
      expect(getDependencyVersion("fixture-dual")).toEqual([-1, -1, -1]);
      expect(consoleError).toHaveBeenCalled();

      consoleError.mockRestore();
    });
  });
});
