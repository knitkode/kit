import { randomInt } from "./randomInt";

describe("randomInt", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each([
    [0, 1, 10, 1],
    [0.999999, 1, 10, 10],
    [0.5, 1, 10, 6],
    [0, -5, 5, -5],
    [0.999999, -5, 5, 5],
    [0.5, -5, 5, 0],
    [0, 0, 0, 0],
    [0.999999, 3, 3, 3],
  ])(
    "maps Math.random() = %d to randomInt(%d, %d) = %d",
    (random, min, max, expected) => {
      vi.spyOn(Math, "random").mockReturnValue(random);
      expect(randomInt(min, max)).toBe(expected);
    },
  );

  it("always returns an integer between min and max included", () => {
    for (let i = 0; i < 500; i++) {
      const value = randomInt(1, 6);
      expect(Number.isInteger(value)).toBe(true);
      expect(value).toBeGreaterThanOrEqual(1);
      expect(value).toBeLessThanOrEqual(6);
    }
  });
});
