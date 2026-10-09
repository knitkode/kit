import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fsWrite } from "./fsWrite";

describe("fsWrite", () => {
  let tmp: string;

  beforeEach(() => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), "kit-"));
  });

  afterEach(() => {
    fs.rmSync(tmp, { recursive: true, force: true });
  });

  const read = (filepath: string) => fs.readFileSync(filepath, "utf8");

  it("writes the content followed by an end of line", async () => {
    const file = path.join(tmp, "file.txt");

    await fsWrite(file, "line 1\nline 2");

    expect(read(file)).toBe(`line 1\nline 2${os.EOL}`);
  });

  it("does not append the end of line with `eol` false", async () => {
    const file = path.join(tmp, "file.txt");

    await fsWrite(file, "content", false);

    expect(read(file)).toBe("content");
  });

  it("creates the missing parent directories", async () => {
    const file = path.join(tmp, "a", "b", "c", "file.txt");

    await fsWrite(file, "content");

    expect(read(file)).toBe(`content${os.EOL}`);
  });

  it("removes the empty lines at the beginning", async () => {
    const file = path.join(tmp, "file.ts");

    await fsWrite(file, "\n\n  \nexport const a = 1;\n  b();\n");

    expect(read(file)).toBe(`export const a = 1;\n  b();\n${os.EOL}`);
  });

  it("overwrites existing files", async () => {
    const file = path.join(tmp, "file.txt");
    fs.writeFileSync(file, "old content that is longer");

    await fsWrite(file, "new");

    expect(read(file)).toBe(`new${os.EOL}`);
  });

  it("writes empty files", async () => {
    const file = path.join(tmp, "file.txt");

    await fsWrite(file, "", false);

    expect(read(file)).toBe("");
  });

  it("drops the leading blank lines but keeps the first line indentation", async () => {
    const file = path.join(tmp, "file.txt");

    await fsWrite(file, "\n  \n  indented\nline 2");

    expect(read(file)).toBe(`  indented\nline 2${os.EOL}`);
  });
});
