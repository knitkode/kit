import { randomUUID } from "node:crypto";
import { cpSync, mkdirSync, realpathSync, renameSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import type { FsMoveAndRestoreTemporaryPathsOptions } from "./fsMoveAndRestoreTemporaryPaths";

/**
 * Rename, or copy and delete when the paths are on different file systems
 * (renaming across devices fails with `EXDEV`, e.g. towards the OS temp folder)
 */
function moveSync(from: string, to: string) {
  mkdirSync(dirname(to), { recursive: true });
  try {
    renameSync(from, to);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "EXDEV") throw error;
    cpSync(from, to, { recursive: true });
    rmSync(from, { force: true, recursive: true });
  }
}

/**
 * Synchronous version of `fsMoveAndRestoreTemporaryPaths`: move the given paths
 * out of `destination` into a temporary folder, run the callback, then move
 * them back, even when the callback throws.
 */
export function fsMoveAndRestoreTemporaryPathsSync(
  options: Omit<FsMoveAndRestoreTemporaryPathsOptions, "callback"> & {
    callback: () => void;
  },
) {
  const {
    paths,
    destination,
    callback,
    tmpRoot = "",
    tmpDir = randomUUID(),
  } = options;

  if (!paths.length) {
    callback();
    return;
  }

  // @see https://www.npmjs.com/package/temp-dir
  // @see https://www.npmjs.com/package/temp-write
  const tmp = join(realpathSync(tmpdir()), tmpRoot, tmpDir);
  const moved: (readonly [temporaryPath: string, restorePath: string])[] = [];

  try {
    for (const target of paths) {
      const temporaryPath = join(tmp, target);
      const restorePath = join(destination, target);

      moveSync(restorePath, temporaryPath);
      moved.push([temporaryPath, restorePath]);
    }

    callback();
  } finally {
    for (const [temporaryPath, restorePath] of moved) {
      rmSync(restorePath, { force: true, recursive: true });
      moveSync(temporaryPath, restorePath);
    }

    rmSync(tmp, { force: true, recursive: true });
  }
}

export default fsMoveAndRestoreTemporaryPathsSync;
