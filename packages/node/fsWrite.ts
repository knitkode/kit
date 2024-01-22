import { appendFile, mkdir, writeFile } from "node:fs/promises";
import { EOL } from "node:os";
import { dirname } from "node:path";

/**
 * Write file
 *
 * @param filepath The absolute file path
 * @param content The file content string
 * @param eol By default we apend a `node:os.EOL` end of line a the end of the file
 */
export async function fsWrite(filepath: string, content: string, eol = true) {
  await mkdir(dirname(filepath), { recursive: true });
  await writeFile(filepath, content);

  if (eol) {
    // @see https://stackoverflow.com/a/72653325/1938970
    await appendFile(filepath, EOL, "utf8");
    // await appendFile(filepath, EOL, "utf8");
  }
}
