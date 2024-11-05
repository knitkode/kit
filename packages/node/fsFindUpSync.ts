import { statSync } from "node:fs";
import { dirname, isAbsolute, join, parse, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const toPath = (urlOrPath?: string | URL) =>
  urlOrPath instanceof URL ? fileURLToPath(urlOrPath) : urlOrPath;

type FsFindUpSyncOptions = {
  /**
   * @default `process.cwd()`
   */
  cwd?: string;
  /**
   * @default "file"
   */
  type?: "file" | "directory";
  /**
   * @default undefined It stops at the root directory of the walked up path
   */
  stopAt?: string | URL;
};

/**
 * Find file or directory path up from the given `cwd`
 *
 * @borrows [sindresorhus/find-up-simple](https://github.com/sindresorhus/find-up-simple)
 *
 * @param name The **file** _name_ or **directory** _name_ to find
 */
export function fsFindUpSync(
  name: string,
  { cwd = process.cwd(), type = "file", stopAt }: FsFindUpSyncOptions = {},
) {
  let directory = resolve(toPath(cwd) ?? "");
  const { root } = parse(directory);
  stopAt = resolve(directory, toPath(stopAt) ?? root);

  while (directory && directory !== stopAt && directory !== root) {
    const filePath = isAbsolute(name) ? name : join(directory, name);

    try {
      const stats = statSync(filePath, { throwIfNoEntry: false });
      if (
        (type === "file" && stats?.isFile()) ||
        (type === "directory" && stats?.isDirectory())
      ) {
        return filePath;
      }
    } catch {
      // do nothing
    }

    directory = dirname(directory);
  }

  return "";
}

export default fsFindUpSync;
