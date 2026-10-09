import { roundTo } from "./roundTo";

test("round decimals to given nr", () => {
  expect(roundTo(1.123456789)).toEqual("1.12");
  expect(roundTo(1.12)).toEqual("1.12");
  expect(roundTo(1.123456789, 3)).toEqual("1.123");
  expect(roundTo(0.123456789, 1)).toEqual("0.1");
  expect(roundTo(1.123456789, 0)).toEqual("1");
});

test("round support already rounded numbers", () => {
  expect(roundTo(1, 3)).toEqual("1");
  expect(roundTo(0, 1)).toEqual("0");
  expect(roundTo(99)).toEqual("99");
  expect(roundTo(100.0, 0)).toEqual("100");
});

describe("roundTo", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it.each([
    [1.5, 0, "2"],
    [1.4999, 0, "1"],
    [-1.234, 2, "-1.23"],
    [-1.236, 2, "-1.24"],
    [1.999, 2, "2"],
    [1234.5678, 2, "1234.57"],
    [0.000123, 4, "0.0001"],
    [1e-7, 2, "0"],
  ])("roundTo(%d, %d) -> %j", (num, decimals, expected) => {
    expect(roundTo(num, decimals)).toBe(expected);
  });

  it.each([
    ["NaN", Number.NaN],
    ["Infinity", Number.POSITIVE_INFINITY],
    ["-Infinity", Number.NEGATIVE_INFINITY],
  ])("returns an empty string for %s", (_label, num) => {
    expect(roundTo(num)).toBe("");
  });

  it("warns about non finite numbers in development", () => {
    vi.stubEnv("NODE_ENV", "development");
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(roundTo(Number.NaN)).toBe("");
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0]?.[0]).toContain("roundTo");
  });

  it("does not warn outside of development", () => {
    vi.stubEnv("NODE_ENV", "production");
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(roundTo(Number.NaN)).toBe("");
    expect(warn).not.toHaveBeenCalled();
  });
});
