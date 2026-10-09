/**
 * Encode a string into digits, a light obfuscation (not an encryption) that
 * `decode` reverses.
 *
 * Each character becomes its 3 digits char code (`a` -> `097`), line breaks
 * included. Characters with a code point of 1000 or more (`€`, CJK, emoji…)
 * become `u` followed by 7 digits, which keeps the output of the most common
 * characters identical to previous versions.
 *
 * @category security
 * @see https://stackoverflow.com/a/22405578/9122820
 */
export let encode = <TReturn extends string>(str: string) => {
  let output = "";

  // iterating the string yields whole code points, an emoji included
  for (const char of str) {
    const code = char.codePointAt(0) as number;
    output +=
      code < 1000
        ? String(code).padStart(3, "0")
        : "u" + String(code).padStart(7, "0");
  }

  return output as TReturn;
};

export default encode;
