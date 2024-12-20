/**
 * Run promises concurrently but keep the given array order in the resolved
 * result array. Useful if you rely on user defined sorting for instance when
 * merging objects returned by an array of promises.
 *
 * @param promises
 * @returns
 */
export let promiseAllSorted = async <T extends Promise<any>[]>(promises: T) =>
  (
    await Promise.all(
      promises.map(async (promise, idx) => ({ v: await promise, i: idx })),
    )
  )
    .sort((a, b) => a.i - b.i)
    .map((data) => data.v as Awaited<T>);

export default promiseAllSorted;
