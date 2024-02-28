/**
 * @category array
 */
export let findDuplicatedIndexes = (arr: any[]) => {
  const indexes: Record<number, true> = {};
  for (let i = 0; i < arr.length; i++) {
    const idxInArray = arr.indexOf(arr[i]);
    if (idxInArray !== i && idxInArray !== -1) {
      indexes[i] = true;
    }
  }

  return indexes;
};

export default findDuplicatedIndexes;
