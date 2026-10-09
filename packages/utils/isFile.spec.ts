import { isFile } from "./isFile";

describe("isFile", () => {
  it.each([
    ["an empty File", new File([], "empty.txt")],
    ["a File with content", new File(["hi"], "a.txt", { type: "text/plain" })],
  ])("returns true for %s", (_label, payload) => {
    expect(isFile(payload)).toBe(true);
  });

  it.each([
    ["a Blob", new Blob(["hi"])],
    ["a file name", "a.txt"],
    ["a file-like object", { name: "a.txt", size: 0 }],
    ["undefined", undefined],
    ["null", null],
  ])("returns false for %s", (_label, payload) => {
    expect(isFile(payload)).toBe(false);
  });
});
