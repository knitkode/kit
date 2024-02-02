import { changeCaseCapital } from "./changeCaseCapital";
import type { Options } from "./changeCaseHelpers";

/**
 * Convert a string to pascal snake case (`Foo_Bar`).
 *
 * @category text
 * @category case
 * @borrows [blakeembrey/change-case](https://github.com/blakeembrey/change-case)
 */
export let changeCasePascalSnake = (input: string, options?: Options) =>
  changeCaseCapital(input, { delimiter: "_", ...options });
