import {
  type Options,
  splitPrefixSuffix,
  upperFactory,
} from "./changeCaseHelpers";

/**
 * Convert a string to constant case (`FOO_BAR`).
 *
 * @category text
 * @category case
 * @borrows [blakeembrey/change-case](https://github.com/blakeembrey/change-case)
 */
export const changeCaseConstant = (input: string, options?: Options) => {
  const [prefix, words, suffix] = splitPrefixSuffix(input, options);
  return (
    prefix +
    words.map(upperFactory(options?.locale)).join(options?.delimiter ?? "_") +
    suffix
  );
};

export default changeCaseConstant;
