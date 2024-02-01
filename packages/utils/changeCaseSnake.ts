import type { Options } from "./changeCaseHelpers";
import { changeCaseNone } from "./changeCaseNone";

/**
 * Convert a string to snake case (`foo_bar`).
 *
 * @category text
 * @category case
 * @borrows [blakeembrey/change-case](https://github.com/blakeembrey/change-case)
 */
export const changeCaseSnake = (input: string, options?: Options) =>
  changeCaseNone(input, { delimiter: "_", ...options });

export default changeCaseSnake;
