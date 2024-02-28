/**
 * @category array
 * @see https://stackoverflow.com/a/8189268/1938970
 * @experimental TODO: untested
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
  } else if (balanced) {
    while (i < len) {
      size = Math.ceil((len - i) / nrOfChunks--);
      output.push(arr.slice(i, (i += size)));
    }
  } else {
    nrOfChunks--;
    size = Math.floor(len / nrOfChunks);
    if (len % size === 0) size--;
    while (i < size * nrOfChunks) {
      output.push(arr.slice(i, (i += size)));
    }
    output.push(arr.slice(size * nrOfChunks));
  }

  return output;
};

export default chunkByChunks;
