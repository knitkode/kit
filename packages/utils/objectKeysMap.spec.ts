import { objectKeysMap } from "./objectKeysMap";

describe("objectKeysMap", () => {
  it("maps each key with its value and index", () => {
    const callback = vi.fn(
      (key: string, value: number, index: number) => `${index}:${key}=${value}`,
    );
    const result = objectKeysMap({ a: 1, b: 2 }, callback);

    expect(result).toEqual(["0:a=1", "1:b=2"]);
    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenNthCalledWith(1, "a", 1, 0);
    expect(callback).toHaveBeenNthCalledWith(2, "b", 2, 1);
  });

  it("returns an empty array for an empty object without calling back", () => {
    const callback = vi.fn();
    expect(objectKeysMap({}, callback)).toEqual([]);
    expect(callback).not.toHaveBeenCalled();
  });
});
