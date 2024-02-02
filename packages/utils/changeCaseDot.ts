import type { Options } from "./changeCaseHelpers";
import { changeCaseNone } from "./changeCaseNone";

/**
 * Convert a string to dot case (`foo.bar`).
 *
 * @category text
 * @category case
 * @borrows [blakeembrey/change-case](https://github.com/blakeembrey/change-case)
 */
export let changeCaseDot = (input: string, options?: Options) =>
  changeCaseNone(input, { delimiter: ".", ...options });
