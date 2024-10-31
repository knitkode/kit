import { existsSync, lstatSync } from "node:fs";
import { mkdir, rm, symlink } from "node:fs/promises";
import { join } from "node:path";
import { glob } from "glob";
import { isString } from "@koine/utils";

type SymlinkExtendedOptions = {
  /**
   * @default true
   */
  override?: boolean;
  /**
   * Symlink everthing inside the `target` folder rather than the `target` itself,
   * optionally pass a glob that points to the desired "sub" targets
   */
  onlyTargetContent?: boolean | string;
};

/**
 * Extended `node:fs/promises.symlink`
 */
export async function fsSymlink(
  target: string,
  dest: string,
  options?: SymlinkExtendedOptions,
) {
  const { override = true, onlyTargetContent } = options || {};
  const symlinkedDestinations = [];

  if (!existsSync(target)) {
    console.log(`Trying to symlink unexisting target ${target}`);
    return [];
  }

  if (existsSync(dest) /*  || lstatSync(dest).isSymbolicLink() */) {
    if (override) {
      if (onlyTargetContent) {
        // remove all symlinks that are going to be re-created found within the target
        await Promise.all(
          (
            await glob(isString(onlyTargetContent) ? onlyTargetContent : "*", {
              cwd: dest,
              withFileTypes: true,
            })
          )
            .filter((foundPath) => foundPath.isSymbolicLink())
            .map((p) => rm(p.fullpath(), { recursive: true })),
        );
      } else {
        await rm(dest, { force: true });
      }
    } else {
      console.log(
        `Trying to symlink existing dest ${dest} without "override: true"`,
      );
      return [];
    }
  } else {
    if (onlyTargetContent) {
      // ensure destination folder exists
      await mkdir(dest, { recursive: true });
    }
  }

  if (onlyTargetContent) {
    // symlink everything found within the target to the destination
    await Promise.all(
      (
        await glob(isString(onlyTargetContent) ? onlyTargetContent : "*", {
          cwd: target,
          withFileTypes: true,
        })
      )
        // .filter((foundPath) => !foundPath.isSymbolicLink())
        .map(async (contentPath) => {
          const relativePath = contentPath.relative();
          await symlink(
            join(target, relativePath),
            join(dest, relativePath),
            contentPath.isDirectory() ? "dir" : "file",
          );
          symlinkedDestinations.push(join(dest, relativePath));
        }),
    );
  } else {
    await symlink(
      target,
      dest,
      lstatSync(target).isDirectory() ? "dir" : "file",
    );
    symlinkedDestinations.push(dest);
  }

  return symlinkedDestinations;
}

export default fsSymlink;
