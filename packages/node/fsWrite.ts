import { appendFileSync, mkdirSync, writeFileSync } from "node:fs";
import { appendFile, mkdir, writeFile } from "node:fs/promises";
import { EOL } from "node:os";
import { dirname } from "node:path";

// /**
//  * Returns the index of the last element in the array where predicate is true, and -1
//  * otherwise.
//  *
//  * @borrows [SO's answer by Nico Timmerman](https://stackoverflow.com/a/53187807/1938970)
//  *
//  * @param array The source array to search in
//  * @param predicate find calls predicate once for each element of the array, in descending
//  * order, until it finds one where predicate returns true. If such an element is found,
//  * findLastIndex immediately returns that element index. Otherwise, findLastIndex returns -1.
//  */
// let findLastIndex = <T>(array: Array<T>, predicate: (value: T, index: number, obj: T[]) => boolean): number => {
//   let l = array.length;
//   while (l--) {
//       if (predicate(array[l], l, array))
//           return l;
//   }
//   return -1;
// }

/**
 * Write file
 *
 * @param filepath The absolute file path
 * @param content The file content string
 * @param eol By default we apend a `node:os.EOL` end of line a the end of the file
 */
export async function fsWrite(filepath: string, content: string, eol = true) {
  await mkdir(dirname(filepath), { recursive: true });

  // remove empty first line
  content = content.replace(/^\s*/m, "");

  await writeFile(filepath, content);

  if (eol) {
    // multiline trim: removes empty lines at begininng and end of a multiline string
    // const lines = content.split("\n");
    // content = lines
    //   // .slice(lines.findIndex(Boolean), lines.findLastIndex(Boolean) - 1)
    //   .slice(lines.findIndex(Boolean), findLastIndex(lines, Boolean) - 1)
    //   .join("\n");

    // @see https://stackoverflow.com/a/72653325/1938970
    await appendFile(filepath, EOL, "utf8");
    // await appendFile(filepath, EOL, "utf8");
  }
}

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
