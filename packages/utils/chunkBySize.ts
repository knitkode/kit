/**
 * @category array
 * @see https://stackoverflow.com/a/40682136/1938970
 */
export let chunkBySize = <T>(arr: T[], size: number): T[][] => {
  const output = [];
  for (let i = 0; i < arr.length; i += size) {
    output.push(arr.slice(i, i + size));
  }
  return output;
};

export default chunkBySize;
