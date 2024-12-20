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
      promises.map(async (promise, idx) => {
        return { _$i: idx, ...(await promise) } as { _$i?: number };
      }),
    )
  )
    .sort((a, b) => (a?._$i || 0) - (b?._$i || 0))
    .map((data) => {
      delete (data as { _$i?: number })["_$i"];
      return data as Awaited<T>;
    });

export default promiseAllSorted;
