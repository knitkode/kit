import { randomKey } from "./randomKey";

describe("randomKey", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const obj = { a: 1, b: 2, c: 3 };

  it.each([
    [0, "a"],
    [0.33, "a"],
    [0.34, "b"],
    [0.66, "b"],
    [0.67, "c"],
    [0.999999, "c"],
  ])("maps Math.random() = %d to the key %j", (random, expected) => {
    vi.spyOn(Math, "random").mockReturnValue(random);
    expect(randomKey(obj)).toBe(expected);
  });

  it("returns the only key of a single key object", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.999999);
    expect(randomKey({ only: true })).toBe("only");
  });

  it("always returns one of the object keys", () => {
    const keys = Object.keys(obj);
    for (let i = 0; i < 200; i++) {
      expect(keys).toContain(randomKey(obj));
    }
  });
});
