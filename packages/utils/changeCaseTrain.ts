import changeCaseCapital from "./changeCaseCapital";
import { type Options } from "./changeCaseHelpers";

/**
 * Convert a string to train case (`Foo-Bar`).
 *
 * @category text
 * @category case
 * @borrows [blakeembrey/change-case](https://github.com/blakeembrey/change-case)
 */
export const changeCaseTrain = (input: string, options?: Options) =>
  changeCaseCapital(input, { delimiter: "-", ...options });

export default changeCaseTrain;
