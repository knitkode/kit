import { shuffle } from "./shuffle";

describe("shuffle", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("keeps the order when Math.random always returns 0", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    expect(shuffle([1, 2, 3, 4])).toEqual([1, 2, 3, 4]);
  });

  it("swaps each item with the last one when Math.random is close to 1", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.999);
    expect(shuffle([1, 2, 3, 4])).toEqual([4, 1, 2, 3]);
  });

  it("uses Math.random to pick the swapped index", () => {
    vi.spyOn(Math, "random")
      .mockReturnValueOnce(0.5)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0.9)
      .mockReturnValueOnce(0);
    // idx 0 <-> 2, idx 1 <-> 1, idx 2 <-> 3, idx 3 <-> 3
    expect(shuffle(["a", "b", "c", "d"])).toEqual(["c", "b", "d", "a"]);
  });

  it("returns a new array with the same items", () => {
    const input = [1, 2, 3, 4, 5];
    const result = shuffle(input);
    expect(result).not.toBe(input);
    expect([...result].sort()).toEqual(input);
    expect(input).toEqual([1, 2, 3, 4, 5]);
  });

  it("returns an empty array for empty or nullish input", () => {
    expect(shuffle([])).toEqual([]);
    // @ts-expect-error testing a nullish input at runtime
    expect(shuffle(null)).toEqual([]);
    // @ts-expect-error testing a nullish input at runtime
    expect(shuffle(undefined)).toEqual([]);
  });
});
