import { randomUUID } from "node:crypto";
import { copyFileSync, mkdirSync, realpathSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import type { FsMoveAndRestoreTemporaryPathsOptions } from "./fsMoveAndRestoreTemporaryPaths";

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

  if (!paths.length) callback();

  // @see https://www.npmjs.com/package/temp-dir
  // @see https://www.npmjs.com/package/temp-write
  const tmp = join(realpathSync(tmpdir()), tmpRoot, tmpDir);

  const pathsInfo = paths.map((target) => {
    const temporaryPath = join(tmp, target);
    const restorePath = join(destination, target);

    mkdirSync(dirname(temporaryPath), { recursive: true });
    copyFileSync(restorePath, temporaryPath);

    return [temporaryPath, restorePath] as const;
  });

  callback();

  pathsInfo.map(([temporaryPath, restorePath]) => {
    mkdirSync(dirname(restorePath), { recursive: true });
    copyFileSync(temporaryPath, restorePath);
  });

  rmSync(tmp, { force: true, recursive: true });
}

export default fsMoveAndRestoreTemporaryPathsSync;
