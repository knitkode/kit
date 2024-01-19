import isNumber from "./isNumber";

/**
 * Returns an array of undefined values of the desired length, useful to build
 * skeleton UIs.
 *
 * @category array
 */
export function getEmptyArray /* <T extends undefined | null = undefined> */(
  length: number | string,
) {
  if (!isNumber(length)) {
    length = parseInt(length, 10);
  }
  return Array.from<undefined>({ length });
}

export default getEmptyArray;
