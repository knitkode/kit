/**
 * @category array
 */
export let removeIndexesFromArray = <T>(
  arr: T[],
  indexes: Record<number, true>,
) => {
  const output: T[] = [];
  for (let i = 0; i < arr.length; i++) {
    // eslint-disable-next-line no-prototype-builtins
    if (!indexes.hasOwnProperty(i)) {
      output.push(arr[i]);
    }
  }
  return output;
};

export default removeIndexesFromArray;
