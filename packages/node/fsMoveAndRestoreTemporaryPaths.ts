import { randomUUID } from "node:crypto";
import { copyFile, mkdir, realpath, rm } from "node:fs/promises";
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

  if (!paths.length) await callback();

  // @see https://www.npmjs.com/package/temp-dir
  // @see https://www.npmjs.com/package/temp-write
  const tmp = join(await realpath(tmpdir()), tmpRoot, tmpDir);

  const pathsInfo = await Promise.all(
    paths.map(async (target) => {
      const temporaryPath = join(tmp, target);
      const restorePath = join(destination, target);

      await mkdir(dirname(temporaryPath), { recursive: true });
      await copyFile(restorePath, temporaryPath);

      return [temporaryPath, restorePath] as const;
    }),
  );

  await callback();

  await Promise.all(
    pathsInfo.map(async ([temporaryPath, restorePath]) => {
      await mkdir(dirname(restorePath), { recursive: true });
      await copyFile(temporaryPath, restorePath);
    }),
  );

  await rm(tmp, { force: true, recursive: true });
}

export default fsMoveAndRestoreTemporaryPaths;
