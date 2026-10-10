import { chunkByChunks } from "./chunkByChunks";

describe("chunkByChunks", () => {
  it("should return the whole array when nrOfChunks is less than 2", () => {
    const arr = [1, 2, 3, 4];
    const result = chunkByChunks(arr, 1); // Only one chunk
    expect(result).toEqual([arr]);

    const result2 = chunkByChunks(arr, 0); // Invalid chunk size
    expect(result2).toEqual([arr]);
  });

  it("should divide the array into equally sized chunks when len % nrOfChunks === 0", () => {
    const arr = [1, 2, 3, 4, 5, 6];
    const result = chunkByChunks(arr, 2);
    expect(result).toEqual([
      [1, 2, 3],
      [4, 5, 6],
    ]);
  });

  it("should divide the array into balanced chunks when len % nrOfChunks !== 0 and balanced is true", () => {
    const arr = [1, 2, 3, 4, 5, 6, 7];
    const result = chunkByChunks(arr, 3, true);
    expect(result).toEqual([
      [1, 2, 3],
      [4, 5],
      [6, 7],
    ]);
  });

  it("should divide the array into unbalanced chunks when len % nrOfChunks !== 0 and balanced is false", () => {
    const arr = [1, 2, 3, 4, 5, 6, 7];
    const result = chunkByChunks(arr, 3, false);
    expect(result).toEqual([[1, 2, 3], [4, 5, 6], [7]]);
  });

  it("should handle edge case when array has exactly one element", () => {
    const arr = [1];
    const result = chunkByChunks(arr, 1);
    expect(result).toEqual([arr]);

    const result2 = chunkByChunks(arr, 2);
    expect(result2).toEqual([[1]]);
  });

  it("should correctly chunk arrays of various sizes and chunk counts", () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    expect(chunkByChunks(arr, 3)).toEqual([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ]);
    expect(chunkByChunks(arr, 4)).toEqual([
      [1, 2],
      [3, 4],
      [5, 6],
      [7, 8, 9],
    ]);
    expect(chunkByChunks(arr, 5)).toEqual([
      [1, 2],
      [3, 4],
      [5, 6],
      [7, 8],
      [9],
    ]);
  });
});

describe("chunkByChunks (more cases)", () => {
  it("returns no chunks for an empty array", () => {
    expect(chunkByChunks([], 3)).toEqual([]);
  });

  it("keeps every item and the order in balanced mode", () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const result = chunkByChunks(arr, 4, true);
    expect(result).toEqual([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8],
      [9, 10],
    ]);
    expect(result.flat()).toEqual(arr);
  });

  it("creates the requested number of chunks in balanced mode", () => {
    expect(chunkByChunks([1, 2, 3, 4, 5], 4, true)).toEqual([
      [1, 2],
      [3],
      [4],
      [5],
    ]);
  });

  it("creates the requested number of chunks in unbalanced mode", () => {
    expect(chunkByChunks([1, 2, 3, 4, 5], 4)).toEqual([[1], [2], [3], [4, 5]]);
    expect(chunkByChunks([1, 2, 3, 4, 5, 6, 7], 5)).toEqual([
      [1],
      [2],
      [3],
      [4],
      [5, 6, 7],
    ]);
  });

  it("uses the largest size that leaves items for the last chunk in unbalanced mode", () => {
    const arr = Array.from({ length: 14 }, (_, i) => i + 1);
    expect(chunkByChunks(arr, 6)).toEqual([
      [1, 2],
      [3, 4],
      [5, 6],
      [7, 8],
      [9, 10],
      [11, 12, 13, 14],
    ]);
  });

  it("gives each item its own chunk when there are less items than chunks", () => {
    expect(chunkByChunks([1, 2, 3], 4)).toEqual([[1], [2], [3]]);
    expect(chunkByChunks([1, 2, 3], 4, true)).toEqual([[1], [2], [3]]);
  });

  it("always returns the requested number of non empty chunks when there are enough items", () => {
    for (let len = 2; len <= 30; len++) {
      const arr = Array.from({ length: len }, (_, i) => i);
      for (let nrOfChunks = 2; nrOfChunks <= len; nrOfChunks++) {
        for (const balanced of [false, true]) {
          const result = chunkByChunks(arr, nrOfChunks, balanced);
          expect(result).toHaveLength(nrOfChunks);
          expect(result.flat()).toEqual(arr);
          expect(result.every((chunk) => chunk.length > 0)).toBe(true);
          if (!balanced) {
            const sizes = new Set(result.slice(0, -1).map((c) => c.length));
            expect(sizes.size).toBe(1);
          }
        }
      }
    }
  });

  it("puts the remainder in the last chunk in unbalanced mode", () => {
    expect(chunkByChunks([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 4)).toEqual([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
      [10],
    ]);
  });
});
