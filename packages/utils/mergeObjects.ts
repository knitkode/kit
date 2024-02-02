import { isObject } from "./isObject";
import { isUndefined } from "./isUndefined";

/**
 * Merge two or more objects together. It mutates the target object.
 *
 * @category object
 * @see https://stackoverflow.com/a/46973278/1938970
 */
export let mergeObjects = <T extends object = object>(
  target: T,
  ...sources: Partial<T>[]
): T => {
  if (!sources.length) {
    return target;
  }
  const source = sources.shift();
  if (source === undefined) {
    return target;
  }

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((_key) => {
      const key = _key as keyof T;
      if (isObject(source[key])) {
        if (!target[key]) {
          target[key] = {} as T[keyof T];
        }
        mergeObjects(target[key] as unknown as T, source[key] as unknown as T);
      } else {
        if (!isUndefined(source[key])) {
          // FIXME: assertion here should not be needed but isUndefined does not
          // seem to narrow the type correctly for some reason
          target[key] = source[key] as T[keyof T];
        }
      }
    });
  }

  return mergeObjects(target, ...sources);
};
