import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fsMoveAndRestoreTemporaryPathsSync } from "./fsMoveAndRestoreTemporaryPathsSync";

describe("fsMoveAndRestoreTemporaryPathsSync", () => {
  let tmp: string;
  let destination: string;
  // the temporary files are written in `os.tmpdir()/<tmpRoot>/<tmpDir>`, we
  // point `tmpRoot` to our own temporary directory so that it gets cleaned up
  let tmpRoot: string;

  const read = (...segments: string[]) =>
    fs.readFileSync(path.join(...segments), "utf8");

  beforeEach(() => {
    tmp = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), "kit-")));
    tmpRoot = path.relative(fs.realpathSync(os.tmpdir()), tmp);
    destination = path.join(tmp, "project");
    fs.mkdirSync(path.join(destination, "nested", "deep"), { recursive: true });
    fs.writeFileSync(path.join(destination, "keep.txt"), "keep");
    fs.writeFileSync(
      path.join(destination, "nested", "deep", "file.json"),
      "{}",
    );
    fs.writeFileSync(path.join(destination, "other.txt"), "other");
  });

  afterEach(() => {
    fs.rmSync(tmp, { recursive: true, force: true });
  });

  it("restores the given paths after the callback", () => {
    fsMoveAndRestoreTemporaryPathsSync({
      paths: ["keep.txt", "nested/deep/file.json"],
      destination,
      tmpRoot,
      callback: () => {
        // e.g. a build that wipes the destination
        fs.rmSync(destination, { recursive: true, force: true });
        fs.mkdirSync(destination);
        fs.writeFileSync(path.join(destination, "built.txt"), "built");
      },
    });

    expect(read(destination, "keep.txt")).toBe("keep");
    expect(read(destination, "nested", "deep", "file.json")).toBe("{}");
    expect(read(destination, "built.txt")).toBe("built");
    expect(fs.existsSync(path.join(destination, "other.txt"))).toBe(false);
  });

  it("restores the original content of modified paths", () => {
    fsMoveAndRestoreTemporaryPathsSync({
      paths: ["keep.txt"],
      destination,
      tmpRoot,
      callback: () => {
        fs.writeFileSync(path.join(destination, "keep.txt"), "changed");
        fs.writeFileSync(path.join(destination, "other.txt"), "changed");
      },
    });

    expect(read(destination, "keep.txt")).toBe("keep");
    expect(read(destination, "other.txt")).toBe("changed");
  });

  it("keeps a temporary copy of the paths while running the callback", () => {
    const tmpDir = "my-tmp-dir";
    const copies: string[] = [];

    fsMoveAndRestoreTemporaryPathsSync({
      paths: ["keep.txt", "nested/deep/file.json"],
      destination,
      tmpRoot,
      tmpDir,
      callback: () => {
        copies.push(
          read(tmp, tmpDir, "keep.txt"),
          read(tmp, tmpDir, "nested", "deep", "file.json"),
        );
      },
    });

    expect(copies).toEqual(["keep", "{}"]);
  });

  it("removes the temporary directory", () => {
    const tmpDir = "my-tmp-dir";

    fsMoveAndRestoreTemporaryPathsSync({
      paths: ["keep.txt"],
      destination,
      tmpRoot,
      tmpDir,
      callback: () => {},
    });

    expect(fs.existsSync(path.join(tmp, tmpDir))).toBe(false);
  });

  it("uses a random temporary directory by default", () => {
    const before = fs.readdirSync(tmp);
    const during: string[] = [];

    fsMoveAndRestoreTemporaryPathsSync({
      paths: ["keep.txt"],
      destination,
      tmpRoot,
      callback: () => {
        during.push(...fs.readdirSync(tmp));
      },
    });

    const created = during.filter((name) => !before.includes(name));
    expect(created).toHaveLength(1);
    expect(created[0]).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    );
    expect(fs.readdirSync(tmp)).toEqual(before);
  });

  it("throws without running the callback when a path does not exist", () => {
    const callback = vi.fn();

    expect(() =>
      fsMoveAndRestoreTemporaryPathsSync({
        paths: ["missing.txt"],
        destination,
        tmpRoot,
        callback,
      }),
    ).toThrow(expect.objectContaining({ code: "ENOENT" }));
    expect(callback).not.toHaveBeenCalled();
  });

  it("moves the paths out while running the callback", () => {
    let existsDuringCallback: boolean | undefined;

    fsMoveAndRestoreTemporaryPathsSync({
      paths: ["keep.txt"],
      destination,
      tmpRoot,
      callback: () => {
        existsDuringCallback = fs.existsSync(
          path.join(destination, "keep.txt"),
        );
      },
    });

    expect(existsDuringCallback).toBe(false);
    expect(read(destination, "keep.txt")).toBe("keep");
  });

  it("runs the callback once when there are no paths", () => {
    const callback = vi.fn();

    fsMoveAndRestoreTemporaryPathsSync({
      paths: [],
      destination,
      tmpRoot,
      callback,
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("restores the paths and rethrows when the callback fails", () => {
    const tmpDir = "my-tmp-dir";

    expect(() =>
      fsMoveAndRestoreTemporaryPathsSync({
        paths: ["keep.txt", "nested/deep/file.json"],
        destination,
        tmpRoot,
        tmpDir,
        callback: () => {
          throw new Error("build failed");
        },
      }),
    ).toThrow("build failed");

    expect(read(destination, "keep.txt")).toBe("keep");
    expect(read(destination, "nested", "deep", "file.json")).toBe("{}");
    expect(fs.existsSync(path.join(tmp, tmpDir))).toBe(false);
  });

  it("restores the paths already moved when a later one does not exist", () => {
    const callback = vi.fn();

    expect(() =>
      fsMoveAndRestoreTemporaryPathsSync({
        paths: ["keep.txt", "missing.txt"],
        destination,
        tmpRoot,
        callback,
      }),
    ).toThrow(expect.objectContaining({ code: "ENOENT" }));

    expect(callback).not.toHaveBeenCalled();
    expect(read(destination, "keep.txt")).toBe("keep");
  });
});
