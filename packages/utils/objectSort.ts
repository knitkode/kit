/**
 * @category object
 *
 * @pure
 * @param data The object whose properties you want to sort
 * @param compareFn Function used to determine the order of the elements. It is expected to return a negative value if the first argument is less than the second argument, zero if they're equal, and a positive value otherwise. If omitted, the elements are sorted in ascending, ASCII character order.
 * @returns a _new_ object
 */
export let objectSort = <T extends object>(
  data: T,
  compareFn?: (
    a: [Extract<keyof T, string>, T[Extract<keyof T, string>]],
    b: [Extract<keyof T, string>, T[Extract<keyof T, string>]],
  ) => number,
) =>
  Object.fromEntries(
    Object.entries(data).sort(
      compareFn as (a: [string, any], b: [string, any]) => number,
    ),
  );
