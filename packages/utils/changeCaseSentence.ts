import {
  type Options,
  capitalCaseTransformFactory,
  lowerFactory,
  splitPrefixSuffix,
  upperFactory,
} from "./changeCaseHelpers";

/**
 * Convert a string to sentence case (`Foo bar`).
 *
 * @category text
 * @category case
 * @borrows [blakeembrey/change-case](https://github.com/blakeembrey/change-case)
 */
export let changeCaseSentence = (input: string, options?: Options) => {
  const [prefix, words, suffix] = splitPrefixSuffix(input, options);
  const lower = lowerFactory(options?.locale);
  const upper = upperFactory(options?.locale);
  const transform = capitalCaseTransformFactory(lower, upper);
  return (
    prefix +
    words
      .map((word, index) => {
        if (index === 0) return transform(word);
        return lower(word);
      })
      .join(options?.delimiter ?? " ") +
    suffix
  );
};

export default changeCaseSentence;
