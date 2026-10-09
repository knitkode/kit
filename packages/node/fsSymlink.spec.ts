import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fsSymlink } from "./fsSymlink";

describe("fsSymlink", () => {
  let tmp: string;
  let target: string;

  const isSymlinkTo = (link: string, linkTarget: string) =>
    fs.lstatSync(link).isSymbolicLink() && fs.readlinkSync(link) === linkTarget;

  beforeEach(() => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), "kit-"));
    // tmp/target/{a.txt,b.md,.hidden,sub/c.txt}
    target = path.join(tmp, "target");
    fs.mkdirSync(path.join(target, "sub"), { recursive: true });
    fs.writeFileSync(path.join(target, "a.txt"), "a");
    fs.writeFileSync(path.join(target, "b.md"), "b");
    fs.writeFileSync(path.join(target, ".hidden"), "hidden");
    fs.writeFileSync(path.join(target, "sub", "c.txt"), "c");
  });

  afterEach(() => {
    vi.restoreAllMocks();
    fs.rmSync(tmp, { recursive: true, force: true });
  });

  it("symlinks a file", async () => {
    const file = path.join(target, "a.txt");
    const dest = path.join(tmp, "link.txt");

    expect(await fsSymlink(file, dest)).toEqual([dest]);
    expect(isSymlinkTo(dest, file)).toBe(true);
    expect(fs.readFileSync(dest, "utf8")).toBe("a");
  });

  it("symlinks a directory", async () => {
    const dest = path.join(tmp, "link");

    expect(await fsSymlink(target, dest)).toEqual([dest]);
    expect(isSymlinkTo(dest, target)).toBe(true);
    expect(fs.readFileSync(path.join(dest, "sub", "c.txt"), "utf8")).toBe("c");
  });

  it("does nothing when the target does not exist", async () => {
    const consoleLog = vi.spyOn(console, "log").mockImplementation(() => {});
    const missing = path.join(tmp, "missing");
    const dest = path.join(tmp, "link");

    expect(await fsSymlink(missing, dest)).toEqual([]);
    expect(fs.existsSync(dest)).toBe(false);
    expect(consoleLog).toHaveBeenCalledWith(expect.stringContaining(missing));
  });

  it("replaces an existing destination file by default", async () => {
    const file = path.join(target, "a.txt");
    const dest = path.join(tmp, "existing.txt");
    fs.writeFileSync(dest, "existing");

    expect(await fsSymlink(file, dest)).toEqual([dest]);
    expect(isSymlinkTo(dest, file)).toBe(true);
  });

  it("replaces an existing destination symlink by default", async () => {
    const dest = path.join(tmp, "link");
    fs.symlinkSync(path.join(target, "a.txt"), dest);

    expect(await fsSymlink(path.join(target, "b.md"), dest)).toEqual([dest]);
    expect(isSymlinkTo(dest, path.join(target, "b.md"))).toBe(true);
  });

  it("keeps an existing destination with `override: false`", async () => {
    const consoleLog = vi.spyOn(console, "log").mockImplementation(() => {});
    const dest = path.join(tmp, "existing.txt");
    fs.writeFileSync(dest, "existing");

    expect(
      await fsSymlink(path.join(target, "a.txt"), dest, { override: false }),
    ).toEqual([]);
    expect(fs.lstatSync(dest).isSymbolicLink()).toBe(false);
    expect(fs.readFileSync(dest, "utf8")).toBe("existing");
    expect(consoleLog).toHaveBeenCalledWith(expect.stringContaining(dest));
  });

  describe("onlyTargetContent", () => {
    it("symlinks every (non hidden) entry of the target into the destination", async () => {
      const dest = path.join(tmp, "dest", "nested");

      const symlinked = await fsSymlink(target, dest, {
        onlyTargetContent: true,
      });

      expect(symlinked.sort()).toEqual(
        ["a.txt", "b.md", "sub"].map((name) => path.join(dest, name)),
      );
      expect(fs.lstatSync(dest).isSymbolicLink()).toBe(false);
      expect(fs.readdirSync(dest).sort()).toEqual(["a.txt", "b.md", "sub"]);
      for (const name of ["a.txt", "b.md", "sub"]) {
        expect(
          isSymlinkTo(path.join(dest, name), path.join(target, name)),
        ).toBe(true);
      }
      expect(fs.readFileSync(path.join(dest, "sub", "c.txt"), "utf8")).toBe(
        "c",
      );
    });

    it("symlinks only the target entries matching the given glob", async () => {
      const dest = path.join(tmp, "dest");

      const symlinked = await fsSymlink(target, dest, {
        onlyTargetContent: "*.txt",
      });

      expect(symlinked).toEqual([path.join(dest, "a.txt")]);
      expect(fs.readdirSync(dest)).toEqual(["a.txt"]);
    });

    it("re-creates the symlinks in an existing destination", async () => {
      const dest = path.join(tmp, "dest");
      fs.mkdirSync(dest);
      fs.writeFileSync(path.join(dest, "own.txt"), "own");
      // a stale symlink matching the glob that is going to be re-created
      fs.symlinkSync(path.join(target, "b.md"), path.join(dest, "a.txt"));

      const symlinked = await fsSymlink(target, dest, {
        onlyTargetContent: "*.txt",
      });

      expect(symlinked).toEqual([path.join(dest, "a.txt")]);
      expect(
        isSymlinkTo(path.join(dest, "a.txt"), path.join(target, "a.txt")),
      ).toBe(true);
      expect(fs.readFileSync(path.join(dest, "own.txt"), "utf8")).toBe("own");
    });

    it("can be run repeatedly on the same destination", async () => {
      const dest = path.join(tmp, "dest");

      await fsSymlink(target, dest, { onlyTargetContent: true });
      const symlinked = await fsSymlink(target, dest, {
        onlyTargetContent: true,
      });

      expect(symlinked).toHaveLength(3);
      expect(fs.readdirSync(dest).sort()).toEqual(["a.txt", "b.md", "sub"]);
    });

    it("keeps an existing destination with `override: false`", async () => {
      const consoleLog = vi.spyOn(console, "log").mockImplementation(() => {});
      const dest = path.join(tmp, "dest");
      fs.mkdirSync(dest);

      expect(
        await fsSymlink(target, dest, {
          onlyTargetContent: true,
          override: false,
        }),
      ).toEqual([]);
      expect(fs.readdirSync(dest)).toEqual([]);
      expect(consoleLog).toHaveBeenCalled();
    });
  });
});
