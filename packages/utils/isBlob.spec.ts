import { isBlob } from "./isBlob";

describe("isBlob", () => {
  it.each([
    ["an empty Blob", new Blob([])],
    ["a Blob with content", new Blob(["hello"], { type: "text/plain" })],
  ])("returns true for %s", (_label, payload) => {
    expect(isBlob(payload)).toBe(true);
  });

  it.each([
    ["a string", "blob"],
    ["an ArrayBuffer", new ArrayBuffer(2)],
    ["a typed array", new Uint8Array(2)],
    ["a blob-like object", { size: 0, type: "" }],
    ["undefined", undefined],
    ["null", null],
  ])("returns false for %s", (_label, payload) => {
    expect(isBlob(payload)).toBe(false);
  });
});
