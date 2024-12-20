import { describe, expect, it } from "vitest";
import { promiseAllSorted } from "./promiseAllSorted";

describe("promiseAllSorted", () => {
  it("resolves promises and maintains array order", async () => {
    const promises = [
      Promise.resolve(3),
      Promise.resolve(1),
      Promise.resolve(2),
    ];

    const result = await promiseAllSorted(promises);

    expect(result).toEqual([3, 1, 2]);
  });

  it("handles mixed resolve times but keeps order", async () => {
    const promises = [
      new Promise((resolve) => setTimeout(() => resolve("A"), 100)),
      new Promise((resolve) => setTimeout(() => resolve("B"), 50)),
      new Promise((resolve) => setTimeout(() => resolve("C"), 200)),
    ];

    const result = await promiseAllSorted(promises);

    expect(result).toEqual(["A", "B", "C"]);
  });

  it("works with empty arrays", async () => {
    const promises: Promise<any>[] = [];

    const result = await promiseAllSorted(promises);

    expect(result).toEqual([]);
  });

  it("throws if one of the promises rejects", async () => {
    const promises = [
      Promise.resolve(3),
      Promise.reject(new Error("Failure")),
      Promise.resolve(2),
    ];

    await expect(promiseAllSorted(promises)).rejects.toThrow("Failure");
  });

  it("handles a mix of synchronous and asynchronous resolutions", async () => {
    const promises = [
      Promise.resolve(1),
      new Promise((resolve) => setTimeout(() => resolve(2), 50)),
      Promise.resolve(3),
    ];

    const result = await promiseAllSorted(promises);

    expect(result).toEqual([1, 2, 3]);
  });
});
