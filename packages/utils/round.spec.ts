import { round } from "./round";

describe("round", () => {
  it.each([
    [1.256, 2, 1.26],
    [1.254, 2, 1.25],
    [1.26, 1, 1.3],
    [-1.256, 2, -1.26],
    [1.2, 2, 1.2],
    [1.999, 2, 2],
    [10, 2, 10],
    [0, 3, 0],
    [123.456789, 4, 123.4568],
  ])("round(%d, %d) -> %d", (number, decimals, expected) => {
    expect(round(number, decimals)).toBe(expected);
  });

  it("returns a number", () => {
    expect(typeof round(1.256, 2)).toBe("number");
  });

  it("drops the trailing zeroes of the rounded value by default", () => {
    expect(round(1.10001, 2)).toBe(1.1);
    expect(round(2.00001, 3)).toBe(2);
  });

  it("returns a string with the trailing zeroes when asked to keep them", () => {
    expect(round(1.256, 2, true)).toBe("1.26");
    expect(round(1.256, 2, 1)).toBe("1.26");
    expect(round(1.2, 2, true)).toBe("1.20");
    expect(round(2, 3, true)).toBe("2.000");
    expect(round(1.7, 0, true)).toBe("2");
    expectTypeOf(round(1.2, 2, true)).toEqualTypeOf<string>();
    expectTypeOf(round(1.2, 2)).toEqualTypeOf<number>();
  });

  it.each([
    [42, undefined],
    [42, null],
    [42, 0],
    [-7, undefined],
  ])(
    "returns integers untouched when decimals are falsy: round(%d, %j)",
    (number, decimals) => {
      expect(round(number, decimals)).toBe(number);
    },
  );

  it.each([
    [1.7, undefined, 2],
    [1.7, 0, 2],
    [1.2, null, 1],
    [-1.7, undefined, -2],
    [2.5, 0, 3],
    [1e21, undefined, 1e21],
  ])(
    "rounds to an integer when decimals are falsy: round(%d, %j) -> %d",
    (number, decimals, expected) => {
      expect(round(number, decimals)).toBe(expected);
    },
  );
});
