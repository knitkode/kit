/**
 * @category text
 *
 * @borrows [blakeembrey/change-case](https://github.com/blakeembrey/change-case/blob/master/packages/title-case/src/index.ts)
 */
export let titleCase = (input?: null | string) =>
  input
    ? input.replace(
        /\w\S*/g,
        (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase(),
      )
    : "";

export default titleCase;
