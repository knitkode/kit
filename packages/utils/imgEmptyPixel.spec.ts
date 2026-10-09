import { imgEmptyPixel } from "./imgEmptyPixel";

describe("imgEmptyPixel", () => {
  const prefix = "data:image/png;base64,";

  it("is a base64 PNG data URI", () => {
    expect(imgEmptyPixel.startsWith(prefix)).toBe(true);
  });

  it("encodes a valid 1x1 PNG", () => {
    const bytes = Buffer.from(imgEmptyPixel.slice(prefix.length), "base64");

    // PNG signature
    expect([...bytes.subarray(0, 8)]).toEqual([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
    ]);
    // IHDR chunk with width and height
    expect(bytes.subarray(12, 16).toString("ascii")).toBe("IHDR");
    expect(bytes.readUInt32BE(16)).toBe(1);
    expect(bytes.readUInt32BE(20)).toBe(1);
  });
});
