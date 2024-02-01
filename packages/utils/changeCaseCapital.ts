import {
  type Options,
  capitalCaseTransformFactory,
  lowerFactory,
  splitPrefixSuffix,
  upperFactory,
} from "./changeCaseHelpers";

/**
 * Convert a string to sentence case (`Foo Bar`).
 *
 * @category text
 * @category case
 * @borrows [blakeembrey/change-case](https://github.com/blakeembrey/change-case)
 */
export const changeCaseCapital = (input: string, options?: Options) => {
  const [prefix, words, suffix] = splitPrefixSuffix(input, options);
  const lower = lowerFactory(options?.locale);
  const upper = upperFactory(options?.locale);
  return (
    prefix +
    words
      .map(capitalCaseTransformFactory(lower, upper))
      .join(options?.delimiter ?? " ") +
    suffix
  );
};

export default changeCaseCapital;
