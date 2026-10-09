import { randomUUID } from "node:crypto";
import { cp, mkdir, realpath, rename, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

export type FsMoveAndRestoreTemporaryPathsOptions = {
  /**
   * Relative paths to move to temporary directory
   */
  paths: string[];
  /**
   * Absolute root path from where the paths should be moved to the temporary
   * directory and then brought back
   */
  destination: string;
  /**
   * Something to performs in-between the move and restore actions
   */
  callback: () => Promise<void>;
  /**
   * Defaults to a random uuid folder name
   *
   * @default ""
   */
  tmpRoot?: string;
  /**
   * Defaults to a random uuid folder name
   *
   * @default randomUUID()
   */
  tmpDir?: string;
};

/**
 * Rename, or copy and delete when the paths are on different file systems
 * (renaming across devices fails with `EXDEV`, e.g. towards the OS temp folder)
 */
async function move(from: string, to: string) {
  await mkdir(dirname(to), { recursive: true });
  try {
    await rename(from, to);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "EXDEV") throw error;
    await cp(from, to, { recursive: true });
    await rm(from, { force: true, recursive: true });
  }
}

/**
 * Move the given paths out of `destination` into a temporary folder, run the
 * callback, then move them back. The paths are restored even when the callback
 * throws (the error is re-thrown afterwards).
 */
export async function fsMoveAndRestoreTemporaryPaths(
  options: FsMoveAndRestoreTemporaryPathsOptions,
) {
  const {
    paths,
    destination,
    callback,
    tmpRoot = "",
    tmpDir = randomUUID(),
  } = options;

  if (!paths.length) {
    await callback();
    return;
  }

  // @see https://www.npmjs.com/package/temp-dir
  // @see https://www.npmjs.com/package/temp-write
  const tmp = join(await realpath(tmpdir()), tmpRoot, tmpDir);
  const moved: (readonly [temporaryPath: string, restorePath: string])[] = [];

  try {
    for (const target of paths) {
      const temporaryPath = join(tmp, target);
      const restorePath = join(destination, target);

      await move(restorePath, temporaryPath);
      moved.push([temporaryPath, restorePath]);
    }

    await callback();
  } finally {
    for (const [temporaryPath, restorePath] of moved) {
      await rm(restorePath, { force: true, recursive: true });
      await move(temporaryPath, restorePath);
    }

    await rm(tmp, { force: true, recursive: true });
  }
}

export default fsMoveAndRestoreTemporaryPaths;
