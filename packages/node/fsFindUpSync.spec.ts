import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { fsFindUpSync } from "./fsFindUpSync";

describe("fsFindUpSync", () => {
  let tmp: string;
  // tmp/a/b/c
  let a: string;
  let b: string;
  let c: string;

  beforeEach(() => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), "kit-"));
    a = path.join(tmp, "a");
    b = path.join(a, "b");
    c = path.join(b, "c");
    fs.mkdirSync(c, { recursive: true });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    fs.rmSync(tmp, { recursive: true, force: true });
  });

  it("finds a file in the `cwd`", () => {
    fs.writeFileSync(path.join(c, "config.json"), "{}");

    expect(fsFindUpSync("config.json", { cwd: c })).toBe(
      path.join(c, "config.json"),
    );
  });

  it("walks up the parent directories", () => {
    fs.writeFileSync(path.join(a, "config.json"), "{}");

    expect(fsFindUpSync("config.json", { cwd: c })).toBe(
      path.join(a, "config.json"),
    );
  });

  it("returns the nearest match", () => {
    fs.writeFileSync(path.join(a, "config.json"), "{}");
    fs.writeFileSync(path.join(b, "config.json"), "{}");

    expect(fsFindUpSync("config.json", { cwd: c })).toBe(
      path.join(b, "config.json"),
    );
  });

  it("finds nested relative paths", () => {
    fs.mkdirSync(path.join(a, ".config"));
    fs.writeFileSync(path.join(a, ".config", "settings.json"), "{}");

    expect(fsFindUpSync(".config/settings.json", { cwd: c })).toBe(
      path.join(a, ".config", "settings.json"),
    );
  });

  it("only finds files by default", () => {
    fs.mkdirSync(path.join(b, "target"));
    fs.writeFileSync(path.join(a, "target"), "");

    expect(fsFindUpSync("target", { cwd: c })).toBe(path.join(a, "target"));
  });

  it("only finds directories with `type: directory`", () => {
    fs.writeFileSync(path.join(b, "target"), "");
    fs.mkdirSync(path.join(a, "target"));

    expect(fsFindUpSync("target", { cwd: c, type: "directory" })).toBe(
      path.join(a, "target"),
    );
  });

  it("returns an empty string when nothing is found", () => {
    expect(fsFindUpSync(`kit-missing-${path.basename(tmp)}`, { cwd: c })).toBe(
      "",
    );
    expect(
      fsFindUpSync(`kit-missing-${path.basename(tmp)}`, {
        cwd: c,
        type: "directory",
      }),
    ).toBe("");
  });

  it("does not look above `stopAt`", () => {
    fs.writeFileSync(path.join(a, "config.json"), "{}");

    expect(fsFindUpSync("config.json", { cwd: c, stopAt: b })).toBe("");
    expect(fsFindUpSync("config.json", { cwd: c, stopAt: tmp })).toBe(
      path.join(a, "config.json"),
    );
  });

  it("accepts `stopAt` as file URL", () => {
    fs.writeFileSync(path.join(a, "config.json"), "{}");

    expect(
      fsFindUpSync("config.json", { cwd: c, stopAt: pathToFileURL(b) }),
    ).toBe("");
    expect(
      fsFindUpSync("config.json", { cwd: c, stopAt: pathToFileURL(tmp) }),
    ).toBe(path.join(a, "config.json"));
  });

  it("resolves a relative `stopAt` from the `cwd`", () => {
    fs.writeFileSync(path.join(a, "config.json"), "{}");

    expect(fsFindUpSync("config.json", { cwd: c, stopAt: ".." })).toBe("");
    expect(fsFindUpSync("config.json", { cwd: c, stopAt: "../../.." })).toBe(
      path.join(a, "config.json"),
    );
  });

  it("checks an absolute `name` as it is", () => {
    const file = path.join(a, "config.json");
    fs.writeFileSync(file, "{}");

    expect(fsFindUpSync(file, { cwd: c })).toBe(file);
    expect(fsFindUpSync(path.join(a, "missing.json"), { cwd: c })).toBe("");
  });

  it("defaults the `cwd` to `process.cwd()`", () => {
    fs.writeFileSync(path.join(b, "config.json"), "{}");
    vi.spyOn(process, "cwd").mockReturnValue(c);

    expect(fsFindUpSync("config.json")).toBe(path.join(b, "config.json"));
  });

  it("ignores paths that cannot be read", () => {
    // `file.txt/inner` throws `ENOTDIR` instead of returning no stats
    fs.writeFileSync(path.join(c, "file.txt"), "");
    fs.mkdirSync(path.join(a, "file.txt"));
    fs.writeFileSync(path.join(a, "file.txt", "inner"), "");

    expect(fsFindUpSync("file.txt/inner", { cwd: c })).toBe(
      path.join(a, "file.txt", "inner"),
    );
  });

  it("searches the `stopAt` directory itself", () => {
    fs.writeFileSync(path.join(b, "marker.txt"), "");

    expect(fsFindUpSync("marker.txt", { cwd: c, stopAt: b })).toBe(
      path.join(b, "marker.txt"),
    );
    expect(fsFindUpSync("marker.txt", { cwd: b, stopAt: b })).toBe(
      path.join(b, "marker.txt"),
    );
  });
});
