/**
 * Flatten an object concatenating its nested keys with the given delimiter
 *
 * @category object
 *
 * @param obj Input object
 * @param delimiter `.` dot by default
 */
export const objectFlat = <
  TReturn extends { [key: string]: unknown },
  TInput extends object = object,
>(
  obj: TInput,
  delimiter = ".",
  parent = "",
) => {
  return Object.keys(obj).reduce((acc, _key) => {
    const key = _key as Extract<keyof typeof obj, string>;
    const propName = (parent ? `${parent}${delimiter}${key}` : key) as Extract<
      keyof TReturn,
      string
    >;
    if (typeof obj[key] === "object") {
      acc = {
        ...acc,
        ...objectFlat(obj[key] as TInput, delimiter, propName),
      };
    } else {
      acc[propName] = obj[key] as any;
    }
    return acc;
  }, {} as TReturn);
};

export default objectFlat;
