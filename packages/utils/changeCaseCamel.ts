import {
  type PascalCaseOptions,
  capitalCaseTransformFactory,
  lowerFactory,
  pascalCaseTransformFactory,
  splitPrefixSuffix,
  upperFactory,
} from "./changeCaseHelpers";

/**
 * Convert a string to camel case (`fooBar`).
 *
 * @category text
 * @category case
 * @borrows [blakeembrey/change-case](https://github.com/blakeembrey/change-case)
 */
export let changeCaseCamel = (input: string, options?: PascalCaseOptions) => {
  const [prefix, words, suffix] = splitPrefixSuffix(input, options);
  const lower = lowerFactory(options?.locale);
  const upper = upperFactory(options?.locale);
  const transform = options?.mergeAmbiguousCharacters
    ? capitalCaseTransformFactory(lower, upper)
    : pascalCaseTransformFactory(lower, upper);
  return (
    prefix +
    words
      .map((word, index) => {
        if (index === 0) return lower(word);
        return transform(word, index);
      })
      .join(options?.delimiter ?? "") +
    suffix
  );
};

export default changeCaseCamel;
