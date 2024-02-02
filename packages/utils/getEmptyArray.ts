import { isNumber } from "./isNumber";

/**
 * Returns an array of undefined values of the desired length, useful to build
 * skeleton UIs.
 *
 * @category array
 */
export let getEmptyArray = /* <T extends undefined | null = undefined> */ (
  length: number | string,
) =>
  Array.from<undefined>({
    length: !isNumber(length) ? parseInt(length, 10) : length,
  });
