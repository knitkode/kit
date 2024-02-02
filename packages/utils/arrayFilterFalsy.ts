/**
 * Given a list it returns it filtered without any falsy values (`null`,
 * `undefined`, `false`, `0`, `""`). It "adjusts" the returned type as well.
 *
 * @category array
 */
export let arrayFilterFalsy = <T extends unknown[]>(list?: null | T) =>
  (list ? list.filter((r) => !!r) : []) as Exclude<
    NonNullable<T>[number],
    undefined | false | 0 | ""
  >[];
