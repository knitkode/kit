/**
 * Omit object properties by removing the given keys, it returns a
 * new object.
 *
 * NOTE: most of the time using a normal [destructuring assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) is enough,
 * use this utility only when it makes sense.
 *
 * @category object
 */
export let objectOmit = <T extends object, Keys extends (keyof T)[]>(
  object: T,
  keys: Keys,
) =>
  Object.keys(object).reduce(
    (output, key) => {
      if (!keys.includes(key as keyof T)) {
        output[key as keyof Omit<T, Keys[number]>] =
          object[key as keyof Omit<T, Keys[number]>];
      }
      return output;
    },
    {} as Omit<T, Keys[number]>,
  );
