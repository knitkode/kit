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
    expect(result).toEqual([
      [1, 2, 3],
      [4, 5, 6],
      [7],
    ]);
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
    expect(chunkByChunks(arr, 4)).toEqual([[1, 2], [3, 4], [5, 6], [7, 8, 9]]);
    expect(chunkByChunks(arr, 5)).toEqual([
      [1, 2],
      [3, 4],
      [5, 6],
      [7, 8],
      [9],
    ]);
  });
});
