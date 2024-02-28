import { appendFileSync, mkdirSync, writeFileSync } from "node:fs";
import { EOL } from "node:os";
import { dirname } from "node:path";

/**
 * Write file
 *
 * @param filepath The absolute file path
 * @param content The file content string
 * @param eol By default we apend a `node:os.EOL` end of line a the end of the file
 */
export function fsWriteSync(filepath: string, content: string, eol = true) {
  mkdirSync(dirname(filepath), { recursive: true });

  // remove empty first line
  content = content.replace(/^\s*/m, "");

  writeFileSync(filepath, content);

  if (eol) {
    // multiline trim: removes empty lines at begininng and end of a multiline string
    // const lines = content.split("\n");
    // content = lines
    //   // .slice(lines.findIndex(Boolean), lines.findLastIndex(Boolean) - 1)
    //   .slice(lines.findIndex(Boolean), findLastIndex(lines, Boolean) - 1)
    //   .join("\n");

    // @see https://stackoverflow.com/a/72653325/1938970
    appendFileSync(filepath, EOL, "utf8");
    // appendFileSync(filepath, EOL, "utf8");
  }
}

export default fsWriteSync;
