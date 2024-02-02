/**
 * @file
 *
 * @borrows [blakeembrey/change-case](https://github.com/blakeembrey/change-case)
 */

// Regexps involved with splitting words in various case formats.
let SPLIT_LOWER_UPPER_RE = /([\p{Ll}\d])(\p{Lu})/gu;
let SPLIT_UPPER_UPPER_RE = /(\p{Lu})([\p{Lu}][\p{Ll}])/gu;

// Used to iterate over the initial split result and separate numbers.
let SPLIT_SEPARATE_NUMBER_RE = /(\d)\p{Ll}|(\p{L})\d/u;

// Regexp involved with stripping non-word characters from the result.
let DEFAULT_STRIP_REGEXP = /[^\p{L}\d]+/giu;

// The replacement value for splits.
let SPLIT_REPLACE_VALUE = "$1\0$2";

// The default characters to keep after transforming case.
let DEFAULT_PREFIX_SUFFIX_CHARACTERS = "";

/**
 * Supported locale values. Use `false` to ignore locale.
 * Defaults to `undefined`, which uses the host environment.
 */
export type Locale = string[] | string | false | undefined;

/**
 * Options used for converting strings to pascal/camel case.
 */
export interface PascalCaseOptions extends Options {
  mergeAmbiguousCharacters?: boolean;
}

/**
 * Options used for converting strings to any case.
 */
export interface Options {
  locale?: Locale;
  split?: (value: string) => string[];
  /** @deprecated Pass `split: splitSeparateNumbers` instead. */
  separateNumbers?: boolean;
  delimiter?: string;
  prefixCharacters?: string;
  suffixCharacters?: string;
}

/**
 * Split any cased input strings into an array of words.
 */
export let split = (value: string) => {
  let result = value.trim();

  result = result
    .replace(SPLIT_LOWER_UPPER_RE, SPLIT_REPLACE_VALUE)
    .replace(SPLIT_UPPER_UPPER_RE, SPLIT_REPLACE_VALUE);

  result = result.replace(DEFAULT_STRIP_REGEXP, "\0");

  let start = 0;
  let end = result.length;

  // Trim the delimiter from around the output string.
  while (result.charAt(start) === "\0") start++;
  if (start === end) return [];
  while (result.charAt(end - 1) === "\0") end--;

  return result.slice(start, end).split(/\0/g);
};

/**
 * Split the input string into an array of words, separating numbers.
 */
export let splitSeparateNumbers = (value: string) => {
  const words = split(value);
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const match = SPLIT_SEPARATE_NUMBER_RE.exec(word);
    if (match) {
      const offset = match.index + (match[1] ?? match[2]).length;
      words.splice(i, 1, word.slice(0, offset), word.slice(offset));
    }
  }
  return words;
};

/**
 * @internal
 */
export let lowerFactory = (locale: Locale): ((input: string) => string) =>
  locale === false
    ? (input: string) => input.toLowerCase()
    : (input: string) => input.toLocaleLowerCase(locale);

/**
 * @internal
 */
export let upperFactory = (locale: Locale): ((input: string) => string) =>
  locale === false
    ? (input: string) => input.toUpperCase()
    : (input: string) => input.toLocaleUpperCase(locale);

/**
 * @internal
 */
export let capitalCaseTransformFactory =
  (lower: (input: string) => string, upper: (input: string) => string) =>
  (word: string) =>
    `${upper(word[0])}${lower(word.slice(1))}`;

/**
 * @internal
 */
export let pascalCaseTransformFactory =
  (lower: (input: string) => string, upper: (input: string) => string) =>
  (word: string, index: number) => {
    const char0 = word[0];
    const initial =
      index > 0 && char0 >= "0" && char0 <= "9" ? "_" + char0 : upper(char0);
    return initial + lower(word.slice(1));
  };

/**
 * @internal
 */
export let splitPrefixSuffix = (
  input: string,
  options: Options = {},
): [string, string[], string] => {
  const splitFn =
    options.split ?? (options.separateNumbers ? splitSeparateNumbers : split);
  const prefixCharacters =
    options.prefixCharacters ?? DEFAULT_PREFIX_SUFFIX_CHARACTERS;
  const suffixCharacters =
    options.suffixCharacters ?? DEFAULT_PREFIX_SUFFIX_CHARACTERS;
  let prefixIndex = 0;
  let suffixIndex = input.length;

  while (prefixIndex < input.length) {
    const char = input.charAt(prefixIndex);
    if (!prefixCharacters.includes(char)) break;
    prefixIndex++;
  }

  while (suffixIndex > prefixIndex) {
    const index = suffixIndex - 1;
    const char = input.charAt(index);
    if (!suffixCharacters.includes(char)) break;
    suffixIndex = index;
  }

  return [
    input.slice(0, prefixIndex),
    splitFn(input.slice(prefixIndex, suffixIndex)),
    input.slice(suffixIndex),
  ];
};
