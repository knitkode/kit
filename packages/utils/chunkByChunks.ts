/**
 * Split an array in the given number of chunks, when `balanced` the chunks
 * sizes differ at most by one, otherwise all the chunks have the same size but
 * the last one, which gets the remaining items. With less items than chunks
 * each item gets its own chunk.
 *
 * @category array
 * @see https://stackoverflow.com/a/8189268/1938970
 */
export let chunkByChunks = <T>(
  arr: T[],
  nrOfChunks: number,
  balanced?: boolean,
): T[][] => {
  if (nrOfChunks < 2) return [arr];

  const len = arr.length;
  const output = [];
  let i = 0;
  let size;

  if (len % nrOfChunks === 0) {
    size = Math.floor(len / nrOfChunks);
    while (i < len) {
      output.push(arr.slice(i, (i += size)));
    }
  } else if (balanced || len < nrOfChunks) {
    while (i < len) {
      size = Math.ceil((len - i) / nrOfChunks--);
      output.push(arr.slice(i, (i += size)));
    }
  } else {
    // the largest size that still leaves at least one item for the last chunk
    size = Math.floor((len - 1) / --nrOfChunks);
    while (i < size * nrOfChunks) {
      output.push(arr.slice(i, (i += size)));
    }
    output.push(arr.slice(i));
  }

  return output;
};

export default chunkByChunks;
