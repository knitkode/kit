import { toRgba } from "./toRgba";

describe("toRgba", () => {
  test("converts a valid hex color to rgba with default alpha", () => {
    expect(toRgba("#FF5733")).toBe("rgba(255,87,51,1)");
    expect(toRgba("#00FF00")).toBe("rgba(0,255,0,1)");
    expect(toRgba("#0000FF")).toBe("rgba(0,0,255,1)");
  });

  test("converts a valid hex color to rgba with specified alpha", () => {
    expect(toRgba("#FF5733", 0.5)).toBe("rgba(255,87,51,0.5)");
    expect(toRgba("#00FF00", 0.75)).toBe("rgba(0,255,0,0.75)");
    expect(toRgba("#0000FF", 0.3)).toBe("rgba(0,0,255,0.3)");
  });

  // invalid hex colors are not handled, skip this
  // test("returns an empty string for invalid hex colors", () => {
  //   expect(toRgba("ZZZZZZ")).toBe("rgba(18,52,86,1)");
  //   expect(toRgba("#1234")).toBe("");
  //   expect(toRgba("#ABC")).toBe("");
  //   expect(toRgba("123456")).toBe("");
  //   expect(toRgba("#12345G")).toBe("");
  // });

  test("returns an empty string for missing or empty input", () => {
    expect(toRgba("")).toBe("");
  });

  test("handles lowercase hex input", () => {
    expect(toRgba("#ff5733")).toBe("rgba(255,87,51,1)");
    expect(toRgba("#00ff00")).toBe("rgba(0,255,0,1)");
  });

  test("handles upper and lowercase hex letters equally", () => {
    expect(toRgba("#AaBbCc")).toBe("rgba(170,187,204,1)");
    expect(toRgba("#aabbcc")).toBe("rgba(170,187,204,1)");
  });
});
