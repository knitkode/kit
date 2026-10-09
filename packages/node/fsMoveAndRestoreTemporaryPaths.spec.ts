import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fsMoveAndRestoreTemporaryPaths } from "./fsMoveAndRestoreTemporaryPaths";

describe("fsMoveAndRestoreTemporaryPaths", () => {
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

  it("restores the given paths after the callback", async () => {
    await fsMoveAndRestoreTemporaryPaths({
      paths: ["keep.txt", "nested/deep/file.json"],
      destination,
      tmpRoot,
      callback: async () => {
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

  it("restores the original content of modified paths", async () => {
    await fsMoveAndRestoreTemporaryPaths({
      paths: ["keep.txt"],
      destination,
      tmpRoot,
      callback: async () => {
        fs.writeFileSync(path.join(destination, "keep.txt"), "changed");
        fs.writeFileSync(path.join(destination, "other.txt"), "changed");
      },
    });

    expect(read(destination, "keep.txt")).toBe("keep");
    expect(read(destination, "other.txt")).toBe("changed");
  });

  it("keeps a temporary copy of the paths while running the callback", async () => {
    const tmpDir = "my-tmp-dir";
    const copies: string[] = [];

    await fsMoveAndRestoreTemporaryPaths({
      paths: ["keep.txt", "nested/deep/file.json"],
      destination,
      tmpRoot,
      tmpDir,
      callback: async () => {
        copies.push(
          read(tmp, tmpDir, "keep.txt"),
          read(tmp, tmpDir, "nested", "deep", "file.json"),
        );
      },
    });

    expect(copies).toEqual(["keep", "{}"]);
  });

  it("moves the paths out while running the callback, then restores them", async () => {
    const events: string[] = [];

    await fsMoveAndRestoreTemporaryPaths({
      paths: ["keep.txt"],
      destination,
      tmpRoot,
      callback: async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        events.push(
          `during: ${fs.existsSync(path.join(destination, "keep.txt"))}`,
        );
        fs.writeFileSync(path.join(destination, "keep.txt"), "overwritten");
        events.push("callback done");
      },
    });
    events.push(`restored: ${read(destination, "keep.txt")}`);

    expect(events).toEqual([
      "during: false",
      "callback done",
      "restored: keep",
    ]);
  });

  it("removes the temporary directory", async () => {
    const tmpDir = "my-tmp-dir";

    await fsMoveAndRestoreTemporaryPaths({
      paths: ["keep.txt"],
      destination,
      tmpRoot,
      tmpDir,
      callback: async () => {},
    });

    expect(fs.existsSync(path.join(tmp, tmpDir))).toBe(false);
  });

  it("uses a random temporary directory by default", async () => {
    const before = fs.readdirSync(tmp);
    const during: string[] = [];

    await fsMoveAndRestoreTemporaryPaths({
      paths: ["keep.txt"],
      destination,
      tmpRoot,
      callback: async () => {
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

  it("rejects without running the callback when a path does not exist", async () => {
    const callback = vi.fn(async () => {});

    await expect(
      fsMoveAndRestoreTemporaryPaths({
        paths: ["missing.txt"],
        destination,
        tmpRoot,
        callback,
      }),
    ).rejects.toMatchObject({ code: "ENOENT" });
    expect(callback).not.toHaveBeenCalled();
  });

  it("runs the callback once when there are no paths", async () => {
    const callback = vi.fn(async () => {});

    await fsMoveAndRestoreTemporaryPaths({
      paths: [],
      destination,
      tmpRoot,
      callback,
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("restores the paths and rethrows when the callback fails", async () => {
    const tmpDir = "my-tmp-dir";

    await expect(
      fsMoveAndRestoreTemporaryPaths({
        paths: ["keep.txt", "nested/deep/file.json"],
        destination,
        tmpRoot,
        tmpDir,
        callback: async () => {
          throw new Error("build failed");
        },
      }),
    ).rejects.toThrow("build failed");

    expect(read(destination, "keep.txt")).toBe("keep");
    expect(read(destination, "nested", "deep", "file.json")).toBe("{}");
    expect(fs.existsSync(path.join(tmp, tmpDir))).toBe(false);
  });

  it("restores the paths already moved when a later one does not exist", async () => {
    const callback = vi.fn(async () => {});

    await expect(
      fsMoveAndRestoreTemporaryPaths({
        paths: ["keep.txt", "missing.txt"],
        destination,
        tmpRoot,
        callback,
      }),
    ).rejects.toMatchObject({ code: "ENOENT" });

    expect(callback).not.toHaveBeenCalled();
    expect(read(destination, "keep.txt")).toBe("keep");
  });
});
