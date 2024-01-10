import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

export async function fsWrite(filepath: string, content: string) {
  await mkdir(dirname(filepath), { recursive: true });
  await writeFile(filepath, content);
}
