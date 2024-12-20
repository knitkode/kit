/**
 * Run promises concurrently but keep the given array order in the resolved
 * result array. Useful if you rely on user defined sorting for instance when
 * merging objects returned by an array of promises.
 *
 * @param promises
 * @param indexKey Temporary object key used on resolved promises data to keep their sorting (defaults to `"_$i"`)
 * @returns
 */
export let promiseAllSorted = async <T extends Promise<any>[]>(
  promises: T,
  indexKey = "_$i",
) =>
  (
    await Promise.all(
      promises.map(async (promise, idx) => {
        return { [indexKey]: idx, ...(await promise) } as Record<
          typeof indexKey,
          number
        >;
      }),
    )
  )
    .sort((a, b) => a[indexKey] - b[indexKey])
    .map((data) => {
      delete (data as Record<typeof indexKey, number>)[indexKey];
      return data as Awaited<T>;
    });

export default promiseAllSorted;
