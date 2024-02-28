import {
  type Options,
  lowerFactory,
  splitPrefixSuffix,
} from "./changeCaseHelpers";

/**
 * Convert a string to space separated lower case (`foo bar`).
 *
 * @category text
 * @category case
 * @borrows [blakeembrey/change-case](https://github.com/blakeembrey/change-case)
 */
export let changeCaseNone = (input: string, options?: Options) => {
  const [prefix, words, suffix] = splitPrefixSuffix(input, options);
  return (
    prefix +
    words.map(lowerFactory(options?.locale)).join(options?.delimiter ?? " ") +
    suffix
  );
};

export default changeCaseNone;
